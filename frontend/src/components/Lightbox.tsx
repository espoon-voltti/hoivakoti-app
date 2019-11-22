import React, { FC } from "react";
import "../styles/Lightbox.scss";
// NOTE: react-images has incorrect ts typings
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const reactImages = require("react-images");

const { default: Carousel, ModalGateway, Modal } = reactImages;

interface Props {
	isOpen: boolean;
	onClose: () => void;
	imageUrls: string[];
}

const Lightbox: FC<Props> = ({ isOpen, onClose, imageUrls }) => {
	const images = imageUrls.map<{ src: string }>(src => ({
		src,
	}));
	return (
		<ModalGateway>
			{isOpen ? (
				<Modal onClose={onClose} allowFullscreen={false}>
					<Carousel views={images} />
				</Modal>
			) : null}
		</ModalGateway>
	);
};

export default Lightbox;
