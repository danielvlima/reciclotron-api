import { AuthGuard } from '@nestjs/passport';

export class PartnerRecoveryGuard extends AuthGuard('partner-recovery') {
  constructor() {
    super();
  }
}
