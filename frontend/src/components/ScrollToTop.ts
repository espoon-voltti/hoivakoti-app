import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop(): null {
	const { pathname, hash } = useLocation();

	useEffect(() => {
		if (hash) {
			setTimeout(() => {
				const hashElement = document.querySelector(hash) as HTMLElement;

				if (hashElement) {
					hashElement.scrollIntoView();
				}
			}, 250);
		} else {
			if (window.scrollY !== 0) {
				window.scrollTo(0, 0);
			}
		}
	}, [pathname, hash]);

	return null;
}
