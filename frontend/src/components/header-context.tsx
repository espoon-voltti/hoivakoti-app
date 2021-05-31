import React, { createContext, FC, useState } from "react";

export enum HeaderStyle {
	GREEN = "green",
	BLUE = "blue",
}

interface HeaderContextState {
	headerStyle: HeaderStyle | null;
	setHeaderStyle: (color: HeaderStyle | null) => void;
}

export const HeaderContext = createContext<HeaderContextState>(
	{} as HeaderContextState,
);

const HeaderContextProvider: FC = ({ children }) => {
	const [headerStyle, setHeaderStyle] = useState<HeaderStyle | null>(null);

	return (
		<HeaderContext.Provider value={{ headerStyle, setHeaderStyle }}>
			{children}
		</HeaderContext.Provider>
	);
};

export default HeaderContextProvider;
