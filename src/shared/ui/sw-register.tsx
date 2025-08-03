"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/shared/lib/sw-register";

export const ServiceWorkerRegister = () => {
	useEffect(() => {
		registerServiceWorker();
	}, []);

	return null;
};
