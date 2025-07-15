import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SidebarLayout from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Addwith Interior CRM",
  description: "Role-based CRM using Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}

      </body>
    </html>
  );
}


