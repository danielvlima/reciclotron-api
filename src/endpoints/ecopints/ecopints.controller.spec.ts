import { Test, TestingModule } from '@nestjs/testing';
import { EcopintsController } from './ecopints.controller';
import { EcopintsService } from './ecopints.service';

describe('EcopintsController', () => {
  let controller: EcopintsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EcopintsController],
      providers: [EcopintsService],
    }).compile();

    controller = module.get<EcopintsController>(EcopintsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
