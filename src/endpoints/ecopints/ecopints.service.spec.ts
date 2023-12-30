import { Test, TestingModule } from '@nestjs/testing';
import { EcopintsService } from './ecopints.service';

describe('EcopintsService', () => {
  let service: EcopintsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EcopintsService],
    }).compile();

    service = module.get<EcopintsService>(EcopintsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
