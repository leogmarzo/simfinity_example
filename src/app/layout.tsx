import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simfinity Example App",
  description: "A basic Next.js app for backend testing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
