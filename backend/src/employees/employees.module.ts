import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController, PublicEmployeesController } from './employees.controller';

@Module({
  controllers: [EmployeesController, PublicEmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
