import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as Sentry from '@sentry/node';
import { SentryModule } from './sentry/sentry.module';

import '@sentry/tracing';

import { ProfilingIntegration } from '@sentry/profiling-node';
import { sampler } from './sentry/sentry.utils';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DNS,
      enabled: !!process.env.SENTRY_DNS,
      debug: process.env.SENTRY_DEBUG === 'true',
      profilesSampleRate: +process.env.SENTRY_PROFILE_SAMPLE_RATE ?? 0,
      tracesSampler: ({ transactionContext: { data } }) => sampler(data.url),
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
