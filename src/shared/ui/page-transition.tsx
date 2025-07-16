"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
	children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				initial={{ x: "100%", opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				exit={{ x: "-100%", opacity: 0 }}
				transition={{
					type: "tween",
					ease: "easeInOut",
					duration: 0.3,
				}}
				className="w-full"
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
