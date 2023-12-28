import { Test, TestingModule } from '@nestjs/testing';
import { RequestEcopointsService } from './request-ecopoints.service';

describe('RequestEcopointsService', () => {
  let service: RequestEcopointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestEcopointsService],
    }).compile();

    service = module.get<RequestEcopointsService>(RequestEcopointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
