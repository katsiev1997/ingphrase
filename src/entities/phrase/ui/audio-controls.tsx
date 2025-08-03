"use client";

import { useState, useRef } from "react";
import { Upload, Trash2, Mic, X, Loader2Icon } from "lucide-react";
import { useUploadAudio } from "../model/mutations/use-upload-audio";
import { useDeleteAudio } from "../model/mutations/use-delete-audio";
import { useAuth } from "@/shared/hooks/use-auth";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface AudioControlsProps {
	phraseId: string;
	audioUrl?: string;
}

export const AudioControls = ({ phraseId, audioUrl }: AudioControlsProps) => {
	const [isRecording, setIsRecording] = useState(false);
	const [showUpload, setShowUpload] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const { user } = useAuth();
	const uploadAudio = useUploadAudio();
	const deleteAudio = useDeleteAudio();

	// Проверяем права доступа
	const canManageAudio = user?.role === "MODERATOR" || user?.role === "ADMIN";

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			await uploadAudio.mutateAsync({
				phraseId,
				audioFile: file,
			});
			setShowUpload(false);
		} catch (error) {
			console.error("Upload error:", error);
		}
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				chunksRef.current.push(event.data);
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
				const audioFile = new File([audioBlob], "recording.wav", {
					type: "audio/wav",
				});

				try {
					await uploadAudio.mutateAsync({
						phraseId,
						audioFile,
					});
				} catch (error) {
					console.error("Upload recording error:", error);
				}
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch (error) {
			console.error("Recording error:", error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream
				.getTracks()
				.forEach((track) => track.stop());
			setIsRecording(false);
		}
	};

	const handleDeleteAudio = async () => {
		if (confirm("Вы уверены, что хотите удалить аудио?")) {
			try {
				await deleteAudio.mutateAsync(phraseId);
			} catch (error) {
				console.error("Delete error:", error);
			}
		}
	};

	return (
		<div className="space-y-2 my-2">
			{audioUrl ?
				<div className="space-y-2">
					<AudioPlayer
						src={audioUrl}
						showJumpControls={false}
						showFilledProgress={true}
						showFilledVolume={true}
						layout="horizontal"
						preload="metadata"
						style={{
							width: "100%",
							borderRadius: "0.5rem",
						}}
						className="custom-audio-player"
					/>

					{canManageAudio && (
						<div className="flex items-center gap-2 w-full">
							<button
								onClick={handleDeleteAudio}
								className="flex-1 flex items-center justify-center py-2 px-4 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
								disabled={uploadAudio.isPending || deleteAudio.isPending}
							>
								{deleteAudio.isPending ?
									<Loader2Icon className="animate-spin" />
								:	<>
										<Trash2 className="h-5 w-5 mr-2" />
										Удалить аудио
									</>
								}
							</button>
						</div>
					)}
				</div>
			:	canManageAudio && (
					<div className="flex items-center gap-2 w-full">
						{!showUpload ?
							<>
								<button
									onClick={() => setShowUpload(true)}
									className="flex-1 flex items-center justify-center py-2 px-4 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
									disabled={uploadAudio.isPending}
								>
									{uploadAudio.isPending ?
										<Loader2Icon className="animate-spin" />
									:	<>
											<Upload className="h-5 w-5 mr-2" />
											Загрузить
										</>
									}
								</button>
								<button
									onClick={isRecording ? stopRecording : startRecording}
									className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
										isRecording ?
											"bg-red-600 text-white hover:bg-red-700"
										:	"bg-emerald-600 text-white hover:bg-emerald-700"
									}`}
									disabled={uploadAudio.isPending}
								>
									<Mic className="h-5 w-5 mr-2" />
									{isRecording ? "Стоп" : "Записать"}
								</button>
							</>
						:	<div className="flex items-center gap-2 w-full">
								<input
									type="file"
									accept="audio/*"
									onChange={handleFileUpload}
									className="hidden"
									id={`audio-upload-${phraseId}`}
								/>
								<label
									htmlFor={`audio-upload-${phraseId}`}
									className="flex-1 flex items-center justify-center py-2 px-4 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
								>
									<Upload className="h-5 w-5 mr-2" />
									Выбрать файл
								</label>
								<button
									onClick={() => setShowUpload(false)}
									className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
						}
					</div>
				)
			}
		</div>
	);
};
