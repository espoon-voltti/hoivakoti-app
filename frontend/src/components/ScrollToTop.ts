import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop(): null {
	const { pathname, hash } = useLocation();

	useEffect(() => {
		if (hash) {
			console.log(hash);
			setTimeout(() => {
				const hashElement = document.querySelector(hash) as HTMLElement;

				if (hashElement) {
					hashElement.scrollIntoView();
				}
			}, 250);
		} else {
			window.scrollTo(0, 0);
		}
	}, [pathname, hash]);

	return null;
}
