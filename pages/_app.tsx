import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import Head from "next/head";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <title>{"S'bookmark"}</title>
      </Head>
      <main className={`${inter.variable} font-inter`}>
        <div className="flex w-auto items-center justify-center space-x-3 rounded-b-xl bg-yellow-400 py-1 ">
          <AiOutlineWarning className="text-lg" />
          <p>website ini masih dalam masa pengembangan</p>
        </div>
        <Component {...pageProps} />
      </main>
    </SessionContextProvider>
  );
}
