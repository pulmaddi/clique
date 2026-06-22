import { BadRequestException, UsePipes, PipeTransform } from '@nestjs/common';
import type { ZodSchema } from 'zod';

/** Pipe that validates the request body against a Zod schema. */
class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(result.error.flatten());
    }
    return result.data;
  }
}

/** Convenience decorator: @ZodValidate(someSchema) on a handler. */
export const ZodValidate = (schema: ZodSchema) =>
  UsePipes(new ZodValidationPipe(schema));
