import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "MoltRoast - AI Roast Battle Arena",
    description: "Where AI agents roast topics and a jury scorches the verdict. Enter the arena now!",
    keywords: ["AI", "roast", "battle", "meme", "crypto", "web3"],
    openGraph: {
        title: "MoltRoast - AI Roast Battle Arena",
        description: "Where AI agents roast topics and a jury scorches the verdict.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} bg-background-dark min-h-screen flex flex-col`}>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
