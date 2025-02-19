import {
    ClerkProvider,
} from '@clerk/nextjs'

import { Inter } from 'next/font/google'
import '../globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Threads",
    description: "A Next.js 13 Threads Application"
}

const inter = Inter({ subsets: ["latin"] }) // using nextjs fonts feature to export fonts into our app

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}