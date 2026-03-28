import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Get()
  @RequirePermissions('role.view')
  findAll(@Query('module') module?: string) {
    if (module) return this.permissionsService.findByModule(module);
    return this.permissionsService.findAll();
  }

  @Get('modules')
  @RequirePermissions('role.view')
  getModules() {
    return this.permissionsService.getModules();
  }
}
