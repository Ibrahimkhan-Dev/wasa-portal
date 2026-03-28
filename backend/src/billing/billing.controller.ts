import { Controller, Get, Param, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('billing.view')
  @Get('batches')
  getBatches(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.billingService.getBatches(page, limit);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('billing.view')
  @Get('batches/:id')
  getBatch(@Param('id') id: string) {
    return this.billingService.getBatch(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('billing.view')
  @Get('bills')
  getBills(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('consumerId') consumerId?: string,
    @Query('status') status?: string,
    @Query('month') month?: string,
  ) {
    return this.billingService.getBills(page, limit, { consumerId, status, month });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('billing.view')
  @Get('bills/:id')
  getBill(@Param('id') id: string) {
    return this.billingService.getBill(id);
  }

  @Public()
  @Get('bills/consumer/:consumerNumber')
  getBillsByConsumerNumber(@Param('consumerNumber') consumerNumber: string) {
    return this.billingService.getBillsByConsumerNumber(consumerNumber);
  }
}
