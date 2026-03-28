import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('complaints')
export class ComplaintsController {
  constructor(private complaintsService: ComplaintsService) {}

  @Public()
  @Post('public')
  createPublic(@Body() body: any) {
    return this.complaintsService.create(body);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('complaint.view')
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.complaintsService.findAll(page, limit, { status, category });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('complaint.view')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('complaint.update')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('remarks') remarks: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.complaintsService.updateStatus(id, status, userId, remarks);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('complaint.assign')
  @Patch(':id/assign')
  assign(
    @Param('id') id: string,
    @Body('employeeId') employeeId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.complaintsService.assign(id, employeeId, userId);
  }
}
