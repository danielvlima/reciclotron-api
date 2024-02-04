import { JwtKeyPayload } from './jwt-key-payload.type';

export type JwtPayload = JwtKeyPayload & {
  email: string;
  level: string;
};
