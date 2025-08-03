"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import type { Dialogue } from "../model/api/get-dialogues-request";

interface DialogueCardProps {
	dialogue: Dialogue;
}

export const DialogueCard = ({ dialogue }: DialogueCardProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="bg-white dark:bg-emerald-900 rounded-lg border border-emerald-200 dark:border-emerald-800 overflow-hidden">
			<div
				className="p-4 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400">
							<MessageSquare className="h-5 w-5" />
						</div>
						<div>
							<h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
								{dialogue.title}
							</h3>
							<p className="text-sm text-emerald-600 dark:text-emerald-400">
								{dialogue.messages.length} сообщений
							</p>
						</div>
					</div>
					<div className="text-emerald-600 dark:text-emerald-400">
						{isExpanded ?
							<ChevronUp className="h-5 w-5" />
						:	<ChevronDown className="h-5 w-5" />}
					</div>
				</div>
			</div>

			{isExpanded && (
				<div className="border-t border-emerald-200 dark:border-emerald-800 p-4">
					<div className="space-y-3">
						{dialogue.messages.map((message, index) => (
							<div
								key={message.id}
								className="p-3 bg-emerald-50 dark:bg-emerald-800 rounded-lg"
							>
								<div className="flex items-start gap-3">
									<div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-200 dark:bg-emerald-700 flex items-center justify-center text-xs font-medium text-emerald-700 dark:text-emerald-300">
										{index + 1}
									</div>
									<div className="flex-1 space-y-2">
										<div>
											<p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
												{message.originalText}
											</p>
										</div>
										<div>
											<p className="text-sm text-emerald-600 dark:text-emerald-400">
												{message.translatedText}
											</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
