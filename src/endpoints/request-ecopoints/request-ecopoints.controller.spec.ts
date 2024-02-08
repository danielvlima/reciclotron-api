import { Test, TestingModule } from '@nestjs/testing';
import { RequestEcopointsController } from './request-ecopoints.controller';
import { RequestEcopointsService } from './request-ecopoints.service';

describe('RequestEcopointsController', () => {
  let controller: RequestEcopointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestEcopointsController],
      providers: [RequestEcopointsService],
    }).compile();

    controller = module.get<RequestEcopointsController>(RequestEcopointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
