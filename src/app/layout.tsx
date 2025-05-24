import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import ReactQueryProvider from "@/shared/providers/react-query-provider";
import { NavMenu } from "@/features/nav-menu";

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
		<html lang="en">
			<body className={`${montserrat.variable} antialiased`}>
				<ReactQueryProvider>
					{children}
					<NavMenu />
				</ReactQueryProvider>
			</body>
		</html>
	);
}
