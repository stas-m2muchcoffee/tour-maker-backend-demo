import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  User = 'User',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role',
});
