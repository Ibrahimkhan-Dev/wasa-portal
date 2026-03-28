import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConsumersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, filters: { zoneId?: string; status?: string; search?: string } = {}) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.zoneId) where.zoneId = filters.zoneId;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { consumerNumber: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.consumer.findMany({
        where,
        skip,
        take: limit,
        include: { zone: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.consumer.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const consumer = await this.prisma.consumer.findUnique({
      where: { id },
      include: { zone: true, connections: { include: { tariffPlan: true } } },
    });
    if (!consumer) throw new NotFoundException('Consumer not found');
    return consumer;
  }

  async findByNumber(consumerNumber: string) {
    const consumer = await this.prisma.consumer.findUnique({
      where: { consumerNumber },
      include: { zone: true },
    });
    if (!consumer) throw new NotFoundException('Consumer not found');
    return consumer;
  }

  async create(data: any) {
    return this.prisma.consumer.create({ data, include: { zone: true } });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.consumer.update({ where: { id }, data, include: { zone: true } });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.consumer.delete({ where: { id } });
    return { message: 'Consumer deleted successfully' };
  }
}
