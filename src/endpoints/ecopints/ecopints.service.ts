import { Injectable } from '@nestjs/common';
import { CreateEcopintDto } from './dto/create-ecopint.dto';
import { UpdateEcopintDto } from './dto/update-ecopint.dto';

@Injectable()
export class EcopintsService {
  create(createEcopintDto: CreateEcopintDto) {
    return 'This action adds a new ecopint';
  }

  findAll() {
    return `This action returns all ecopints`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ecopint`;
  }

  update(id: number, updateEcopintDto: UpdateEcopintDto) {
    return `This action updates a #${id} ecopint`;
  }

  remove(id: number) {
    return `This action removes a #${id} ecopint`;
  }
}
