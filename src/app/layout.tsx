import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});


export const metadata: Metadata = {
  title: 'Diario de Emociones',
  description: 'Una aplicación para ayudarte a entender, registrar y explorar tus emociones diarias a través de un diario personal e interactivo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${ptSans.variable} h-full`}>
      <body className="font-body antialiased h-full bg-background">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
