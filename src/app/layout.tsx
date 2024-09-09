import { Providers } from "@/components/Providers";
import "./globals.css";
import Analytics from "@/components/Analytics";
import { Inter } from "next/font/google";
import Script from "next/script";
import Head from "next/head";


// const metadata: Metadata = {
//
// }


// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`light ${inter.className}`}>
      <Head>
        <link rel="shortcut icon" href="/logo.png" />
      </Head>
      <Analytics />
      <Script type='text/javascript' src='//pl24302002.cpmrevenuegate.com/ee/3b/a2/ee3ba2eabe1d675c1ec4175e6682ebca.js'></Script>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
