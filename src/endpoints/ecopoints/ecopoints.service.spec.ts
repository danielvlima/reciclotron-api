import { Test, TestingModule } from '@nestjs/testing';
import { EcopointsService } from './ecopoints.service';

describe('EcopointsService', () => {
  let service: EcopointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EcopointsService],
    }).compile();

    service = module.get<EcopointsService>(EcopointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
