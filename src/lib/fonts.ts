import localFont from "next/font/local";

export const satoshi = localFont({
	src: [
		{
			path: "../../public/fonts/Satoshi-Variable.woff2",
			weight: "100 900",
			style: "normal",
		},
		{
			path: "../../public/fonts/Satoshi-VariableItalic.woff2",
			weight: "100 900",
			style: "italic",
		},
	],
	variable: "--font-satoshi",
	display: "swap",
});

export const archivo = localFont({
	src: [
		{
			path: "../../public/fonts/ArchivoNarrow.ttf",
			weight: "100 700",
			style: "normal",
		},
	],
	variable: "--font-archivo",
	display: "swap",
});
