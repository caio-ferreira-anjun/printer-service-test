import { Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { LabelDTO } from './DTO/print.dto';
 
@ApiTags('Printer Service')
@Controller('print')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async print(@Query() {client, label, container, plp, grid, packages} : LabelDTO) {
    return this.appService.printFunction({
      client,
      label,
      container,
      plp,
      grid, 
      packages
    })
  }
}
