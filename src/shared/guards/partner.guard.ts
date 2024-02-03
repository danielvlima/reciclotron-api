import { AuthGuard } from '@nestjs/passport';

export class PartnerGuard extends AuthGuard('partner') {
  constructor() {
    super();
  }
}
