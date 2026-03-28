import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ConsumersService } from './consumers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('consumers')
export class ConsumersController {
  constructor(private consumersService: ConsumersService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('consumer.view')
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('zoneId') zoneId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.consumersService.findAll(page, limit, { zoneId, status, search });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('consumer.view')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consumersService.findOne(id);
  }

  @Public()
  @Get('by-number/:consumerNumber')
  findByNumber(@Param('consumerNumber') consumerNumber: string) {
    return this.consumersService.findByNumber(consumerNumber);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('consumer.create')
  @Post()
  create(@Body() body: any) {
    return this.consumersService.create(body);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('consumer.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.consumersService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('consumer.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consumersService.remove(id);
  }
}
