'use server'
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Configuración del servidor
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
      
      ignoreErrors: [
        "Error getting lead by nit",
        "Not Found",
        /Lead with nit .* not found/i,
        "Failed to retrieve auth token",
      ],

      beforeSend(event: Sentry.ErrorEvent, hint: Sentry.EventHint) {
        if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
          (frame: any) => frame.function === 'getLeadByNit'
        )) {
          return null;
        }

        if (event.request?.url?.includes('/lead?nit=')) {
          return null;
        }

        return event;
      },
    });
  }
} 