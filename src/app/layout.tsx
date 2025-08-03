import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import ReactQueryProvider from "@/shared/providers/react-query-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { NavMenu } from "@/features/nav-menu";
import {
	PageTransitionAutoAnimate,
	ThemeScript,
	ServiceWorkerRegister,
} from "@/shared/ui";
import Script from "next/script";

const montserrat = Montserrat({
	variable: "--font-geist-sans",
	subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
	title: "IngPhrase",
	description: "Ingush-Russian phrasebook",
};

export const viewport: Viewport = {
	themeColor: "#000000",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

const isProduction = process.env.NODE_ENV === "production";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<head>
				<ThemeScript />
			</head>
			<body
				className={`${montserrat.variable} min-h-screen bg-emerald-50 dark:bg-background dark:text-foreground`}
			>
				<ThemeProvider>
					<ReactQueryProvider>
						<PageTransitionAutoAnimate>{children}</PageTransitionAutoAnimate>
						<NavMenu />
						<ServiceWorkerRegister />
					</ReactQueryProvider>
				</ThemeProvider>
				{isProduction && (
					<Script id="metrika-counter" strategy="afterInteractive">
						{`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(99303003, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
   });`}
					</Script>
				)}
			</body>
		</html>
	);
}
