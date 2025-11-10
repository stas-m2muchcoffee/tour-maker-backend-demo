import { Reflector } from '@nestjs/core';
import { UserRole } from '../../shared/enums/user-role.enum';

export const Roles = Reflector.createDecorator<UserRole[]>();
