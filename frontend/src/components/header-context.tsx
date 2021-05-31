import React, { createContext, FC, useState } from "react";

export enum HeaderStyle {
	DEFAULT = "default",
	GREEN = "green",
	BLUE = "blue",
}

interface HeaderContextState {
	headerStyle: HeaderStyle;
	setHeaderStyle: (color: HeaderStyle) => void;
}

export const HeaderContext = createContext<HeaderContextState>(
	{} as HeaderContextState,
);

const HeaderContextProvider: FC = ({ children }) => {
	const [headerStyle, setHeaderBorderColor] = useState<HeaderStyle>(
		HeaderStyle.DEFAULT,
	);

	const setHeaderStyle = (color: HeaderStyle): void => {
		setHeaderBorderColor(color);
	};

	return (
		<HeaderContext.Provider value={{ headerStyle, setHeaderStyle }}>
			{children}
		</HeaderContext.Provider>
	);
};

export default HeaderContextProvider;
