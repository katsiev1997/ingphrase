"use client";

import {
	BookHeart,
	House,
	MessagesSquare,
	Search,
	UserRoundCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavMenuItems = [
	{
		href: "/",
		Icon: House,
	},
	{
		href: "/search",
		Icon: Search,
	},
	{
		href: "/dialogs",
		Icon: MessagesSquare,
	},
	{
		href: "/favorites",
		Icon: BookHeart,
	},
	{
		href: "/profile",
		Icon: UserRoundCog,
	},
];

export const NavMenu = () => {
	const pathname = usePathname();

	return (
		<nav className="flex items-center justify-around fixed bottom-0 left-0 right-0 h-20 pb-4 border-t border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950">
			{NavMenuItems.map(({ href, Icon }) => (
				<Link href={href} key={href}>
					<Icon
						className={`text-emerald-600 dark:text-emerald-400 ${
							pathname === href ? "text-emerald-800 dark:text-emerald-200" : ""
						}`}
						strokeWidth={pathname === href ? 3 : 1.5}
					/>
				</Link>
			))}
		</nav>
	);
};
