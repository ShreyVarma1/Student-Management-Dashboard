import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header/header";
import { AppProvider } from "../context/context";
import { AuthProvider } from "../context/auth_context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeRegistry from "../theme_registry";
import { Box } from "@mui/material";

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

              <Box
                component="main"
                sx={{
                  minHeight: "100vh",
                  paddingTop: "72px",
                  width: "100%",
                }}
              >
                {children}
              </Box>

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