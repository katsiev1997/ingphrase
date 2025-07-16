import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import ReactQueryProvider from "@/shared/providers/react-query-provider";
import { NavMenu } from "@/features/nav-menu";
import { PageTransition } from "@/shared/ui";

const montserrat = Montserrat({
	variable: "--font-geist-sans",
	subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
	title: "IngPhrase",
	description: "Ingush-Russian phrasebook",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<body
				className={`${montserrat.variable} min-h-screen bg-emerald-50 dark:bg-background dark:text-foreground`}
			>
				<ReactQueryProvider>
					<PageTransition>{children}</PageTransition>
					<NavMenu />
				</ReactQueryProvider>
			</body>
		</html>
	);
}
