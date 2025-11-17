import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { toLower, trim, replace } from 'lodash';

import { ShouldExistValidator } from '../../shared/validators/should-exist-validator';
import { UserService } from '../../user/user.service';

@InputType()
export class SignUpInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  @Validate(
    ShouldExistValidator,
    ShouldExistValidator.params({
      service: UserService,
      prop: 'email',
      reverse: true,
    }),
  )
  @Transform(({ value }: { value: string }) =>
    toLower(replace(trim(value), /\s+/g, '')),
  )
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @Field(() => [String])
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  preferences: string[];
}
