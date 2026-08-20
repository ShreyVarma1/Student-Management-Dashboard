import type { Metadata } from "next";
import Header from "../components/header/header";
import Sidebar from "..//components/sidebar/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Management Dashboard",
  description: "Student management dashboard built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Sidebar />

        <main
          style={{
            marginLeft: "240px",
            paddingTop: "64px",
            minHeight: "100vh",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}