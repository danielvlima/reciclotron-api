import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtKeyPayload } from '../types';

export const GetCurrentKey = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtKeyPayload;
    return user.sub;
  },
);
