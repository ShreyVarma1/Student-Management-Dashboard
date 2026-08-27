import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header/header";
import { AppProvider,} from "../context/context";
import {AuthProvider,} from "../context/auth_context";
import {ToastContainer,} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeRegistry from "../theme_registry";

export const metadata: Metadata = {
  title: "Student Management Dashboard",
  description:
    "Student Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <AppProvider>
              <Header />

              <main
                style={{
                  paddingTop: "80px",
                  minHeight: "100vh",
                }}
              >
                {children}
              </main>

              <ToastContainer
                position="top-right"
                autoClose={3000}
              />
            </AppProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}