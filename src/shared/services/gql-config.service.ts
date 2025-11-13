import { GqlOptionsFactory } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { Context } from 'graphql-ws';
import { Request } from 'express';
import GraphQLJSON from 'graphql-type-json';
import { Environment } from '../enums/environment.enum';
import { UserService } from '../../user/user.service';
import { WsContextWithUser } from '../../../types/types';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      autoSchemaFile: 'schema.gql',
      playground: false,
      introspection: true,
      installSubscriptionHandlers: true,
      sortSchema: true,
      resolvers: { JSON: GraphQLJSON },
      fieldResolverEnhancers: ['guards', 'interceptors', 'filters'],
      plugins: [
        this.config.get('ENVIRONMENT') !== Environment.Prod
          ? ApolloServerPluginLandingPageLocalDefault({
              embed: { endpointIsEditable: true },
            })
          : ApolloServerPluginLandingPageProductionDefault(),
      ],
      subscriptions: {
        'graphql-ws': {
          onConnect: async (ctx: WsContextWithUser) => {
            const { connectionParams, extra } = ctx;
            try {
              const token = this.authService.getToken(
                connectionParams?.authorization,
              );
              const user = await this.userService.findOne({ where: { token } });
              extra.user = user;
            } catch {
              extra.user = null;
            }
          },
        },
      },
      context: ({
        req,
        connection,
      }: {
        req: Request;
        connection: { context?: Context };
      }) => {
        if (connection?.context) {
          return { req: connection.context };
        }
        return { req };
      },
    };
  }
}
