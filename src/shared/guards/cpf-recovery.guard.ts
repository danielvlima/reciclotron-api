import { AuthGuard } from '@nestjs/passport';

export class CpfRecoveryGuard extends AuthGuard('cpf-recovery') {
  constructor() {
    super();
  }
}
