import * as Joi from 'joi';
import { Environment } from './shared/enums/environment.enum';

const PARAMS = {
  // general
  PORT: Joi.number().default(4000),
  ENVIRONMENT: Joi.string()
    .valid(...Object.values(Environment))
    .required(),
  JWT_SECRET_KEY: Joi.string().required(),

  // database
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string(),
  POSTGRES_PASSWORD: Joi.string(),

  OPENROUTE_SERVICE_API_KEY: Joi.string().required(),
  GEMINI_API_KEY: Joi.string().required(),
};

export const configSchema = Joi.object<typeof PARAMS>(PARAMS);
