import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToolKit - Personal Web Tool Manager",
  description: "Organize, tag, and visualize all your bookmarked web tools, resources, and libraries in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
