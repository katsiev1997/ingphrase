import type { MetaArgs } from "react-router";
import { Welcome } from "../welcome/welcome";

export function meta({}: MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return <Welcome />;
}
