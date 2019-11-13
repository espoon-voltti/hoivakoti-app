module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier/@typescript-eslint",
		"plugin:prettier/recommended",
	],
	settings: {
		react: {
			pragma: "React",
			version: "detect",
		},
	},
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly",
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2018,
		sourceType: "module",
	},
	plugins: ["react", "@typescript-eslint", "prettier", "react-hooks"],
	rules: {
		"react/prop-types": ["off"],
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "error",
	},
};
