import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { compare } from 'bcryptjs';
import { UserService } from '../../user/user.service';
import { SignInInput } from '../../auth/dto/sign-in.input';

@Injectable()
@ValidatorConstraint({ async: true })
export class MatchPasswordValidator implements ValidatorConstraintInterface {
  constructor(private readonly moduleRef: ModuleRef) {}

  async validate(
    password: string,
    { object }: ValidationArguments,
  ): Promise<boolean> {
    const signInInput = object as SignInInput;
    const userService = this.moduleRef.get<UserService>(UserService, {
      strict: false,
    });

    const user = await userService.findOneBy({ email: signInInput.email });
    if (!user) {
      return false;
    }

    return compare(password, user.password);
  }

  defaultMessage() {
    return 'Wrong email or password';
  }
}
