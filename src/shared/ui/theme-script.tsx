export function ThemeScript() {
	return (
		<script
			dangerouslySetInnerHTML={{
				__html: `
					(function() {
						try {
							var theme = localStorage.getItem('theme');
							var resolvedTheme;
							
							if (theme === 'system' || !theme) {
								resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
							} else {
								resolvedTheme = theme;
							}
							
							document.documentElement.classList.remove('light', 'dark');
							document.documentElement.classList.add(resolvedTheme);
						} catch (e) {}
					})();
				`,
			}}
		/>
	);
}
