import { Controller, Get, Post, Param, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('employee.view')
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('departmentId') departmentId?: string,
    @Query('zoneId') zoneId?: string,
    @Query('status') status?: string,
  ) {
    return this.employeesService.findAll(page, limit, { departmentId, zoneId, status });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('employee.view')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('employee.manage')
  @Post(':id/qr')
  generateQr(@Param('id') id: string) {
    return this.employeesService.generateQr(id);
  }
}

@Controller('public/employees')
export class PublicEmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Public()
  @Get(':publicSlug')
  getPublicProfile(@Param('publicSlug') publicSlug: string) {
    return this.employeesService.getPublicProfile(publicSlug);
  }
}
