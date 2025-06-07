export type Post = {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags?: string[];
	author?: {
		name: string;
		avatar?: string;
	};
};
