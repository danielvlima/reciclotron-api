import { Test, TestingModule } from '@nestjs/testing';
import { EcopointsController } from './ecopoints.controller';
import { EcopointsService } from './ecopoints.service';

describe('EcopointsController', () => {
  let controller: EcopointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EcopointsController],
      providers: [EcopointsService],
    }).compile();

    controller = module.get<EcopointsController>(EcopointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
