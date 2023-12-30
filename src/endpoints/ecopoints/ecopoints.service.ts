import { Injectable } from '@nestjs/common';
import { CreateEcopointDto } from './dto/create-ecopoint.dto';
import { UpdateEcopointDto } from './dto/update-ecopoint.dto';

@Injectable()
export class EcopointsService {
  create(createEcopointDto: CreateEcopointDto) {
    return 'This action adds a new ecopoint';
  }

  findAll() {
    return `This action returns all ecopoints`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ecopoint`;
  }

  update(id: number, updateEcopointDto: UpdateEcopointDto) {
    return `This action updates a #${id} ecopoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} ecopoint`;
  }
}
