import React, { FC } from "react";
import { useT } from "../i18n";
// NOTE: react-images has incorrect ts typings
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const reactImages = require("react-images");

const { default: Carousel, ModalGateway, Modal } = reactImages;

export interface ImageView {
	src: string;
	caption: string | null;
}

interface Props {
	state: "hidden" | number;
	onClose: () => void;
	images: ImageView[];
}

const stylesModal = {
	blanket: (base: any) => ({
		...base,
		backgroundColor: "#fff",
	}),
};

const stylesCarousel = {
	header: (base: any) => ({
		...base,
		background: "none !important",
	}),
	headerClose: (base: any) => ({
		...base,
		color: "#6e6e6e",
		":hover": { color: "#0f0f0f" },
	}),
	footer: (base: any) => ({
		...base,
		background: "#fff !important",
	}),
	footerCaption: (base: any) => ({
		...base,
		color: "#0f0f0f",
		fontSize: "16px",
		background: "#fff",
		textAlign: "center",
		width: "100%",
	}),
	footerCount: (base: any) => ({
		...base,
		color: "#0f0f0f",
		fontSize: "16px",
		background: "#fff",
	}),
	navigationNext: (base: any) => ({
		...base,
		color: "#6e6e6e",
		":hover": { color: "#0f0f0f" },
	}),
	navigationPrev: (base: any) => ({
		...base,
		color: "#6e6e6e",
		":hover": { color: "#0f0f0f" },
	}),
};

/*const FooterCount: FC<Props> = (props: any) => {
	const { currentIndex, getStyles, isFullscreen, isModal, views } = props;
	const state = { isFullscreen, isModal };
	const activeView = currentIndex + 1;
	const totalViews = views.length;

	if (!activeView || !totalViews) return null;

	return (
		<div className={"footer__count"}>
			{activeView} of {totalViews}
		</div>
	);
};*/

const Lightbox: FC<Props> = ({ state, onClose, images }) => {
	const isOpen = state !== "hidden";

	const nextTitle = useT("imageCarouselNextTitle");
	const prevTitle = useT("imageCarouselPrevTitle");
	const closeLabel = useT("imageCarouselCloseText");
	const altText = useT("imageCarouselAltText");

	const formatters = {
		getAltText: ({ data, index }: any) => {
			if (data.caption) return data.caption;
			return `${altText} ${index + 1}`;
		}, // {caption} | Image {currentIndex}
		getNextLabel: ({ currentIndex, views }: any) => {
			return `Näytä kuva ${currentIndex + 2}`;
		}, // Show slide {nextIndex} of {totalCount}
		getPrevLabel: ({ currentIndex, views }: any) => {
			return `Näytä kuva ${currentIndex}`;
		}, // Show slide {prevIndex} of {totalCount}
		getNextTitle: (props: any) => {
			return nextTitle;
		}, // Next (right arrow)
		getPrevTitle: (props: any) => {
			return prevTitle;
		}, // Previous (left arrow)
		getCloseLabel: (props: any) => {
			return closeLabel;
		}, // Close (esc)
		getFullscreenLabel: ({ isFullscreen }: any) => {
			return isFullscreen
				? "Poistu kokoruututilasta (f)"
				: "Kokoruututilaan (f)";
		}, // [Enter | Exit] fullscreen (f)
	};

	return (
		<ModalGateway>
			{isOpen ? (
				<Modal
					onClose={onClose}
					allowFullscreen={false}
					styles={stylesModal}
				>
					<Carousel
						views={images}
						styles={stylesCarousel}
						currentIndex={state}
						hideControlsWhenIdle={1e6}
						interactionIsIdle={false}
						formatters={formatters}
						//components={{ FooterCount: FooterCount }}
					/>
				</Modal>
			) : null}
		</ModalGateway>
	);
};

export default Lightbox;
