import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationGuard } from './authentication.guard';

describe('AuthenticationGuard', () => {
  let service: AuthenticationGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationGuard],
    }).compile();

    service = module.get<AuthenticationGuard>(AuthenticationGuard);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
