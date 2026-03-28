import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, filters: { departmentId?: string; zoneId?: string; status?: string } = {}) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.departmentId) where.departmentId = filters.departmentId;
    if (filters.zoneId) where.zoneId = filters.zoneId;
    if (filters.status) where.status = filters.status;

    const [data, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip,
        take: limit,
        include: {
          department: true,
          zone: true,
          qrProfile: { select: { publicSlug: true, verificationStatus: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.employee.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: { department: true, zone: true, qrProfile: true },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async generateQr(id: string) {
    await this.findOne(id);

    const existing = await this.prisma.qrProfile.findUnique({ where: { employeeId: id } });
    if (existing) {
      return this.prisma.qrProfile.update({
        where: { employeeId: id },
        data: { publicSlug: uuidv4(), verificationStatus: 'active' },
      });
    }

    return this.prisma.qrProfile.create({
      data: {
        employeeId: id,
        publicSlug: uuidv4(),
        verificationStatus: 'active',
      },
    });
  }

  async getPublicProfile(publicSlug: string) {
    const qrProfile = await this.prisma.qrProfile.findUnique({
      where: { publicSlug },
      include: {
        employee: {
          select: {
            fullName: true,
            photoUrl: true,
            designation: true,
            employeeCode: true,
            status: true,
            isPubliclyVerifiable: true,
            department: { select: { name: true } },
            zone: { select: { name: true } },
          },
        },
      },
    });

    if (!qrProfile || qrProfile.verificationStatus !== 'active') {
      throw new NotFoundException('Verification profile not found or inactive');
    }

    if (!qrProfile.employee.isPubliclyVerifiable) {
      throw new NotFoundException('This employee is not publicly verifiable');
    }

    return {
      fullName: qrProfile.employee.fullName,
      photoUrl: qrProfile.employee.photoUrl,
      designation: qrProfile.employee.designation,
      employeeCode: qrProfile.employee.employeeCode,
      department: qrProfile.employee.department?.name,
      zone: qrProfile.employee.zone?.name,
      status: qrProfile.employee.status,
      verificationStatus: qrProfile.verificationStatus,
    };
  }
}
