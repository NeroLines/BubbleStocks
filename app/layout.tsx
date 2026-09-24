import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppWalletProvider } from "@/components/WalletProvider";
import { BottomNav } from "@/components/BottomNav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700"] });

const DESC = "Launch BubbleStocks on Solana that seed real STOCK/USDC liquidity. Trading fees compound into the pool, then flow back to holders.";

export const metadata: Metadata = {
  title: { default: "BubbleStocks · Turn memes into market liquidity", template: "%s · BubbleStocks" },
  description: DESC,
  applicationName: "BubbleStocks",
  keywords: ["Solana", "BubbleStock", "launchpad", "Meteora", "DeFi", "liquidity", "meme token"],
  openGraph: {
    title: "BubbleStocks · Turn memes into market liquidity",
    description: DESC,
    siteName: "BubbleStocks",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "BubbleStocks", description: DESC },
};

export const viewport = { themeColor: [
  { media: "(prefers-color-scheme: light)", color: "#f7f9fd" },
  { media: "(prefers-color-scheme: dark)", color: "#080b12" },
] };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('bs-theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}try{var n=performance.getEntriesByType('navigation')[0];if(n&&n.type==='reload'){history.scrollRestoration='manual';if(location.hash)history.replaceState(null,'',location.pathname+location.search);addEventListener('load',function(){requestAnimationFrame(function(){scrollTo(0,0);history.scrollRestoration='auto';});},{once:true});}}catch(e){}`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${display.variable} pb-16 md:pb-0`}>
        <AppWalletProvider>
          {children}
          <BottomNav />
        </AppWalletProvider>
      </body>
    </html>
  );
}
