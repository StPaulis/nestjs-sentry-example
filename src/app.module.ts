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
      tracesSampleRate: 1.0,
      debug: true,
      profilesSampleRate: 1.0, // Profiling sample rate is relative to tracesSampleRate
      integrations: [
        // Add profiling integration to list of integrations
        new ProfilingIntegration(),
      ],
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
