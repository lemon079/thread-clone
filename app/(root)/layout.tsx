import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 14 Threads Application",
  openGraph: {
    title: "Your Project Name",
    description: "A Next.js 14 Threads Application",
    images: [
      {
        url: "/capture.jpg", // Path to your image in the public folder
        width: 1200,
        height: 630,
        alt: "Thread App Preview",
      },
    ],
  },

}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <Topbar />

          <main className="flex flex-row">
            <LeftSidebar />

            <section className="main-container">
              <div className="w-full max-w-4xl">
                {children}
              </div>
            </section>

            <RightSidebar />
          </main>

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
