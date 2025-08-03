import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import ReactQueryProvider from "@/shared/providers/react-query-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { NavMenu } from "@/features/nav-menu";
import { PageTransitionAutoAnimate, ThemeScript } from "@/shared/ui";

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
					</ReactQueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
