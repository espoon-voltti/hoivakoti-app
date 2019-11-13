import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const it: (...p: any) => any;

it("renders without crashing", () => {
	const div = document.createElement("div");
	ReactDOM.render(<App />, div);
	ReactDOM.unmountComponentAtNode(div);
});
