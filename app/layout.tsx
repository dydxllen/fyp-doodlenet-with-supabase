import "./globals.css";

export const metadata = {
  title: "Doodle It Out",
  description: "Interactive doodle recognition system for language learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
