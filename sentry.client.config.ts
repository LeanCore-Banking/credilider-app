import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Ajusta el porcentaje de transacciones de rendimiento que se envían a Sentry
  tracesSampleRate: 1.0,

  // Ajusta el porcentaje de réplicas que se envían a Sentry
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
 
}); 