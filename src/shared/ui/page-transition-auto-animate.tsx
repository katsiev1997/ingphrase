"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";

interface PageTransitionProps {
	children: ReactNode;
}

const pages = [
	"/",
	"/phrases",
	"/search",
	"/dialogs",
	"/favorites",
	"/profile",
	"/auth",
];

// Helper function to get the base path for comparison
const getBasePath = (path: string): string => {
	const cleanPath = path === "/" ? "/" : path.replace(/\/$/, "");

	for (const page of pages) {
		if (cleanPath === page || cleanPath.startsWith(page + "/")) {
			return page;
		}
	}

	return "/" + cleanPath.split("/")[1];
};

const getTransformClass = (
	isAnimating: boolean,
	direction: "left" | "right"
) => {
	if (!isAnimating) return "transform translate-x-0";

	return direction === "right" ?
			"transform translate-x-full"
		:	"transform -translate-x-full";
};

export function PageTransitionAutoAnimate({ children }: PageTransitionProps) {
	const pathname = usePathname();
	const [parent] = useAutoAnimate({
		duration: 300,
		easing: "ease-in-out",
	});
	const [previousPath, setPreviousPath] = useState<string | null>(null);
	const [direction, setDirection] = useState<"left" | "right">("right");
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (previousPath && previousPath !== pathname) {
			const currentBasePath = getBasePath(pathname);
			const previousBasePath = getBasePath(previousPath);

			const currentIndex = pages.indexOf(currentBasePath);
			const previousIndex = pages.indexOf(previousBasePath);

			if (currentIndex !== -1 && previousIndex !== -1) {
				// If next page is to the left in array, current page slides left
				const newDirection = currentIndex < previousIndex ? "left" : "right";

				setDirection(newDirection);
				setIsAnimating(true);

				// Reset animation state after transition
				setTimeout(() => {
					setIsAnimating(false);
				}, 300);
			}
		}
		setPreviousPath(pathname);
	}, [pathname, previousPath]);

	return (
		<div
			ref={parent}
			className={`w-full transition-transform duration-300 ease-in-out ${getTransformClass(isAnimating, direction)}`}
		>
			{children}
		</div>
	);
}
