export const GA_TRACKING_ID = process.env.GOOGLE_ANALYTICS_ID || "G-6VR2LB8ZH9";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL): void => {
	window.gtag("config", GA_TRACKING_ID, {
		page_path: url,
	});
};

type GTagEvent = {
	action: string;
	category: string;
	label: string;
	value: number;
};

export const event = ({ action, category, label, value }: GTagEvent): void => {
	window.gtag("event", action, {
		event_category: category,
		event_label: label,
		value,
	});
};
