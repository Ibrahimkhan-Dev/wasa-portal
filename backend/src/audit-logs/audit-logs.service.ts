import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 50, filters: { module?: string; userId?: string } = {}) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.module) where.module = filters.module;
    if (filters.userId) where.userId = filters.userId;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        include: { user: { select: { fullName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async create(data: {
    userId?: string;
    module: string;
    action: string;
    recordType?: string;
    recordId?: string;
    description?: string;
    ipAddress?: string;
  }) {
    return this.prisma.auditLog.create({ data });
  }
}
