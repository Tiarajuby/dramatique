import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import Providers from '@/components/Providers'
import ConsumerChrome from '@/components/layout/ConsumerChrome'

export const metadata: Metadata = {
  title: 'Dramatique — Short Dramas. Big Emotions. Endless Stories.',
  description: 'Stream the best micro-drama series. CEO Romance, Supernatural, Revenge, Crime Thriller.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-brand-black text-brand-text antialiased">
        <Providers>
          <ToastProvider>
            <ConsumerChrome>{children}</ConsumerChrome>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  )
}
