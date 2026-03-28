import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  private generateComplaintNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 90000) + 10000;
    return `WASA-${year}${month}-${random}`;
  }

  async findAll(page = 1, limit = 20, filters: { status?: string; category?: string } = {}) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = filters.category;

    const [data, total] = await Promise.all([
      this.prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        include: {
          consumer: { select: { fullName: true, consumerNumber: true } },
          assignedEmployee: { select: { fullName: true, employeeCode: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.complaint.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      include: {
        consumer: true,
        assignedEmployee: { select: { fullName: true, employeeCode: true, designation: true } },
        statusHistory: {
          include: { changedByUser: { select: { fullName: true } } },
          orderBy: { changedAt: 'asc' },
        },
      },
    });
    if (!complaint) throw new NotFoundException('Complaint not found');
    return complaint;
  }

  async create(data: {
    consumerNumber?: string;
    submittedByName: string;
    submittedByPhone: string;
    category: string;
    subject: string;
    description: string;
  }) {
    let consumerId: string | undefined;

    if (data.consumerNumber) {
      const consumer = await this.prisma.consumer.findUnique({
        where: { consumerNumber: data.consumerNumber },
      });
      if (consumer) consumerId = consumer.id;
    }

    return this.prisma.complaint.create({
      data: {
        complaintNumber: this.generateComplaintNumber(),
        consumerId,
        category: data.category,
        subject: data.subject,
        description: data.description,
        submittedByName: data.submittedByName,
        submittedByPhone: data.submittedByPhone,
      },
    });
  }

  async updateStatus(id: string, newStatus: string, userId: string, remarks?: string) {
    const complaint = await this.findOne(id);

    await this.prisma.complaintStatusHistory.create({
      data: {
        complaintId: id,
        oldStatus: complaint.status,
        newStatus: newStatus as any,
        changedBy: userId,
        remarks,
      },
    });

    return this.prisma.complaint.update({
      where: { id },
      data: { status: newStatus as any },
    });
  }

  async assign(id: string, employeeId: string, userId: string) {
    await this.findOne(id);

    await this.prisma.complaintStatusHistory.create({
      data: {
        complaintId: id,
        oldStatus: 'pending',
        newStatus: 'assigned',
        changedBy: userId,
        remarks: `Assigned to employee ${employeeId}`,
      },
    });

    return this.prisma.complaint.update({
      where: { id },
      data: { assignedEmployeeId: employeeId, status: 'assigned' },
    });
  }
}
