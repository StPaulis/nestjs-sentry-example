import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as Sentry from '@sentry/node';
import { SentryModule } from './sentry/sentry.module';

import '@sentry/tracing';

import { ProfilingIntegration } from '@sentry/profiling-node';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DNS,
      tracesSampleRate: +process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0,
      debug: process.env.SENTRY_DEBUG === 'true',
      profilesSampleRate: +process.env.SENTRY_PROFILE_SAMPLE_RATE ?? 0,
      integrations: [new ProfilingIntegration()],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
