import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getBillingSummary(month?: string) {
    const where: any = {};
    if (month) where.billMonth = month;

    const [total, paid, unpaid, overdue] = await Promise.all([
      this.prisma.bill.count({ where }),
      this.prisma.bill.count({ where: { ...where, status: 'paid' } }),
      this.prisma.bill.count({ where: { ...where, status: 'unpaid' } }),
      this.prisma.bill.count({ where: { ...where, status: 'overdue' } }),
    ]);

    const totalAmount = await this.prisma.bill.aggregate({
      where,
      _sum: { totalAmount: true },
    });

    return { total, paid, unpaid, overdue, totalAmount: totalAmount._sum.totalAmount };
  }

  async getComplaintSummary() {
    const [total, pending, inProgress, resolved, closed] = await Promise.all([
      this.prisma.complaint.count(),
      this.prisma.complaint.count({ where: { status: 'pending' } }),
      this.prisma.complaint.count({ where: { status: 'in_progress' } }),
      this.prisma.complaint.count({ where: { status: 'resolved' } }),
      this.prisma.complaint.count({ where: { status: 'closed' } }),
    ]);

    return { total, pending, inProgress, resolved, closed };
  }

  async getDashboardStats() {
    const [totalConsumers, activeEmployees, pendingComplaints, totalBills] = await Promise.all([
      this.prisma.consumer.count({ where: { status: 'active' } }),
      this.prisma.employee.count({ where: { status: 'active' } }),
      this.prisma.complaint.count({ where: { status: 'pending' } }),
      this.prisma.bill.count(),
    ]);

    const recentBatches = await this.prisma.billingBatch.findMany({
      take: 5,
      orderBy: { uploadedAt: 'desc' },
      include: { uploadedByUser: { select: { fullName: true } } },
    });

    const recentComplaints = await this.prisma.complaint.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { consumer: { select: { fullName: true, consumerNumber: true } } },
    });

    return {
      stats: { totalConsumers, activeEmployees, pendingComplaints, totalBills },
      recentBatches,
      recentComplaints,
    };
  }
}
