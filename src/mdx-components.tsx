import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

// Define custom components for MDX files
export const mdxComponents: MDXComponents = {
	// Use custom components for HTML elements
	h2: ({ children }) => <h2 className="text-desktop-h3 font-medium">{children}</h2>,
	h3: ({ children }) => <h3 className="text-desktop-h4 font-medium">{children}</h3>,
	p: ({ children }) => <p className="text-desktop-body">{children}</p>,
	li: ({ children }) => <li className="text-desktop-body">{children}</li>,
	a: ({ href, children }) => (
		<Link href={href || "#"} className="text-secondary hover:text-accent">
			{children}
		</Link>
	),
	img: (props) => <Image sizes="100vw" style={{ width: "100%", height: "auto" }} width={800} height={400} alt={props.alt || ""} {...props} />,
};
