import { Loader2Icon } from "lucide-react";

interface LoaderProps {
	size?: "sm" | "md" | "lg";
	className?: string;
}

export const Loader = ({ size = "lg", className = "" }: LoaderProps) => {
	const sizeClasses = {
		sm: "h-6 w-6",
		md: "h-12 w-12",
		lg: "h-20 w-20",
	};

	return (
		<div className="w-full flex justify-center items-center h-full">
			<Loader2Icon
				className={`animate-spin text-emerald-600 dark:text-emerald-400 ${sizeClasses[size]} ${className}`}
			/>
		</div>
	);
};
