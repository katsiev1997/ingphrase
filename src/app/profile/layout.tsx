import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Профиль | IngPhrase",
	description: "Управление настройками профиля",
};

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
