import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zebu CRUD App",
  description: "A simple CRUD application for Zebu Animation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
