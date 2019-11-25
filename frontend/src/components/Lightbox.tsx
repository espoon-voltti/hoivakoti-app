import React, { FC } from "react";
import "../styles/Lightbox.scss";
// NOTE: react-images has incorrect ts typings
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const reactImages = require("react-images");

const { default: Carousel, ModalGateway, Modal } = reactImages;

export interface ImageView {
	src: string;
	caption: string | null;
}

interface Props {
	isOpen: boolean;
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
		background: "none !important",
	}),
	footerCaption: (base: any) => ({
		...base,
		color: "#0f0f0f",
		fontSize: "16px",
		textAlign: "center",
		width: "100%",
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

const Lightbox: FC<Props> = ({ isOpen, onClose, images }) => {
	return (
		<ModalGateway>
			{isOpen ? (
				<Modal
					onClose={onClose}
					allowFullscreen={false}
					styles={stylesModal}
				>
					<Carousel views={images} styles={stylesCarousel} />
				</Modal>
			) : null}
		</ModalGateway>
	);
};

export default Lightbox;
