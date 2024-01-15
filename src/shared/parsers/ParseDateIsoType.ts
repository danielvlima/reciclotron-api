/* eslint-disable @typescript-eslint/no-unused-vars */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseDateIsoPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value ? new Date(value).toISOString() : null;
  }
}
