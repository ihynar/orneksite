import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Pırıl Koltuk Yıkama",
  description: "Next.js + Postgres tekil uygulama",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
