import { Amplify } from 'aws-amplify';

import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/Providers";
import { getAwsConfig } from '@/auth/AuthProvider/aws-exports';
import { Metadata } from 'next'
import ZendeskWidget from '@/components/common/ZendeskWidget';

async function configureAmplify() {
  const config = await getAwsConfig();
  Amplify.configure(config);
}

configureAmplify();

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Credilider app",
  description: "Generated by Leancore",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <ZendeskWidget />
      </body>
    </html>
  );
}

/* import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} */

