import { AuthGuard } from '@nestjs/passport';

export class CpfGuard extends AuthGuard('cpf') {
  constructor() {
    super();
  }
}
