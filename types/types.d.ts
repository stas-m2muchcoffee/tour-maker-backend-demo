import { Request } from 'express';
import { Context } from 'graphql-ws';
import { ClsStore } from 'nestjs-cls';

import { User } from '../user/models/user.entity';

export type RequestWithUser = Request & { user?: User };

export type ContextWithUser = { req: RequestWithUser };

export type WsContextWithUser = Context<
  Record<string, string>,
  { user?: User }
>;

export type WsRequestWithUser = {
  req: Context<Record<string, unknown>, { user?: User }>;
};

export interface AppClsStore extends ClsStore {
  user: User;
}

export interface GenerateGroupInterface {
  generateGroups(): string[];
}
