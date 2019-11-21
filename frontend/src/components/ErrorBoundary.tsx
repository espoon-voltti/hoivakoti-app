import React, { ReactNode } from "react";
import PageError from "./PageError";

type State = { hasError: false } | { hasError: true; error: Error };

export default class ErrorBoundary extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error };
	}

	// componentDidCatch(error, errorInfo) {
	// 	// You can also log the error to an error reporting service
	// 	// logErrorToMyService(error, errorInfo);
	// }

	componentDidMount(): void {
		window.addEventListener("unhandledrejection", event => {
			this.setState({ hasError: true, error: event.reason });
		});
	}

	render(): ReactNode {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <PageError error={this.state.error} />;
		}

		return this.props.children;
	}
}
