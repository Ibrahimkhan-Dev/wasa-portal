import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.reportsService.getDashboardStats();
  }

  @Get('billing')
  @RequirePermissions('reports.view')
  getBillingSummary(@Query('month') month?: string) {
    return this.reportsService.getBillingSummary(month);
  }

  @Get('complaints')
  @RequirePermissions('reports.view')
  getComplaintSummary() {
    return this.reportsService.getComplaintSummary();
  }
}
