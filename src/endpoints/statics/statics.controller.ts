import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { StaticsService } from './statics.service';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard, PartnerGuard } from 'src/shared/guards';
import { Public } from 'src/shared/decorators';

@ApiTags('Estatísticas')
@Controller('statics')
export class StaticsController {
  constructor(private readonly staticsService: StaticsService) {}

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('admin')
  partner() {
    return this.staticsService.findAll();
  }

  @UseGuards(PartnerGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('partner')
  admin() {
    return this.staticsService.findAll();
  }
}
