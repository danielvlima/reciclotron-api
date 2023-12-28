import { Injectable } from '@nestjs/common';
import { CreateRequestEcopointDto } from './dto/create-request-ecopoint.dto';
import { UpdateRequestEcopointDto } from './dto/update-request-ecopoint.dto';

@Injectable()
export class RequestEcopointsService {
  create(createRequestEcopointDto: CreateRequestEcopointDto) {
    return 'This action adds a new requestEcopoint';
  }

  findAll() {
    return `This action returns all requestEcopoints`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requestEcopoint`;
  }

  update(id: number, updateRequestEcopointDto: UpdateRequestEcopointDto) {
    return `This action updates a #${id} requestEcopoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestEcopoint`;
  }
}
