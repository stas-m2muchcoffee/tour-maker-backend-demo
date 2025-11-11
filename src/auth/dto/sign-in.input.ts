import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { ShouldExistValidator } from '../../shared/validators/should-exist-validator';
import { UserService } from '../../user/user.service';
import { Transform } from 'class-transformer';
import { toLower, trim, replace } from 'lodash';
import { MatchPasswordValidator } from '../../shared/validators/match-password-validator';

@InputType()
export class SignInInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  @Validate(
    ShouldExistValidator,
    ShouldExistValidator.params({
      service: UserService,
      prop: 'email',
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
  @Validate(MatchPasswordValidator)
  password: string;
}
