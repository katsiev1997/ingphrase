"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyContent() {
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading"
	);
	const [message, setMessage] = useState("");
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const token = searchParams.get("token");

		if (!token) {
			setStatus("error");
			setMessage("Токен не найден");
			return;
		}

		// Вызываем API для верификации токена
		fetch(`/api/auth/verify?token=${token}`)
			.then((response) => {
				if (response.ok) {
					setStatus("success");
					setMessage("Авторизация успешна! Перенаправление...");
					// Перенаправляем на главную страницу через 2 секунды
					setTimeout(() => {
						router.push("/");
					}, 2000);
				} else {
					return response.json().then((data) => {
						throw new Error(data.error || "Ошибка верификации");
					});
				}
			})
			.catch((error) => {
				setStatus("error");
				setMessage(error.message || "Произошла ошибка при верификации");
			});
	}, [searchParams, router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					{status === "loading" && (
						<>
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
							<h2 className="text-xl font-semibold text-gray-900 mb-2">
								Проверка токена...
							</h2>
							<p className="text-gray-600">
								Пожалуйста, подождите, мы проверяем вашу ссылку для входа.
							</p>
						</>
					)}

					{status === "success" && (
						<>
							<div className="text-green-500 text-6xl mb-4">✓</div>
							<h2 className="text-xl font-semibold text-gray-900 mb-2">
								Успешная авторизация!
							</h2>
							<p className="text-gray-600">{message}</p>
						</>
					)}

					{status === "error" && (
						<>
							<div className="text-red-500 text-6xl mb-4">✗</div>
							<h2 className="text-xl font-semibold text-gray-900 mb-2">
								Ошибка верификации
							</h2>
							<p className="text-gray-600 mb-4">{message}</p>
							<button
								onClick={() => router.push("/")}
								className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
							>
								Вернуться на главную
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

function LoadingFallback() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Загрузка...
					</h2>
					<p className="text-gray-600">Пожалуйста, подождите.</p>
				</div>
			</div>
		</div>
	);
}

export default function VerifyPage() {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<VerifyContent />
		</Suspense>
	);
}
