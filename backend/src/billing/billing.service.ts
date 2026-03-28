import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async getBatches(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.billingBatch.findMany({
        skip,
        take: limit,
        include: { uploadedByUser: { select: { fullName: true, email: true } } },
        orderBy: { uploadedAt: 'desc' },
      }),
      this.prisma.billingBatch.count(),
    ]);
    return { data, total, page, limit };
  }

  async getBatch(id: string) {
    const batch = await this.prisma.billingBatch.findUnique({
      where: { id },
      include: {
        uploadedByUser: { select: { fullName: true, email: true } },
        batchErrors: true,
        _count: { select: { bills: true } },
      },
    });
    if (!batch) throw new NotFoundException('Billing batch not found');
    return batch;
  }

  async getBills(page = 1, limit = 20, filters: { consumerId?: string; status?: string; month?: string } = {}) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.consumerId) where.consumerId = filters.consumerId;
    if (filters.status) where.status = filters.status;
    if (filters.month) where.billMonth = filters.month;

    const [data, total] = await Promise.all([
      this.prisma.bill.findMany({
        where,
        skip,
        take: limit,
        include: { consumer: { select: { fullName: true, consumerNumber: true } } },
        orderBy: { generatedAt: 'desc' },
      }),
      this.prisma.bill.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async getBill(id: string) {
    const bill = await this.prisma.bill.findUnique({
      where: { id },
      include: {
        consumer: true,
        billItems: true,
        billingBatch: { select: { batchName: true, billingMonth: true } },
      },
    });
    if (!bill) throw new NotFoundException('Bill not found');
    return bill;
  }

  async getBillsByConsumerNumber(consumerNumber: string) {
    const consumer = await this.prisma.consumer.findUnique({ where: { consumerNumber } });
    if (!consumer) throw new NotFoundException('Consumer not found');

    return this.prisma.bill.findMany({
      where: { consumerId: consumer.id },
      include: { billItems: true },
      orderBy: { generatedAt: 'desc' },
    });
  }
}
