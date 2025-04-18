import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import ModelContext from "../Context/ModelContext";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 15 Threads Application"
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ModelContext>
      <ClerkProvider>
        <html lang="en">
          <body className={`${inter.className} antialiased`}>
            <Toaster position="bottom-right" duration={3000} />
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
    </ModelContext>

  );
}
