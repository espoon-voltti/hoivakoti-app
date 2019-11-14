/* eslint-disable @typescript-eslint/camelcase */
import React, { FC, useState } from "react";
import ReactMapboxGl, { Layer, Feature, Popup } from "react-mapbox-gl";
import { NursingHomeSmall } from "./nursinghome-small";
import { NursingHome } from "./types";
import "../styles/Map.scss";

interface Props {
	nursingHomes: NursingHome[];
}

const MapComponent = ReactMapboxGl({
	accessToken: "pk.eyJ1IjoidHphZXJ1LXJlYWt0b3IiLCJhIjoiY2sxZzIxazd0MHg0eDNubzV5Mm41MnJzdCJ9.vPaqUY1S8qHgfzwHUuYUcg",
	scrollZoom: true,
	interactive: false,
	minZoom: 11,
	maxZoom: 11,
});

const Map: FC<Props> = ({ nursingHomes }) => {
	const [popup, setPopup] = useState<{ center: [number, number]; nursingHome: NursingHome } | null>(null);

	return (
		<MapComponent
			/* eslint-disable-next-line react/style-prop-object */
			style="mapbox://styles/mapbox/streets-v9"
			center={[24.6559, 60.2055]}
			containerStyle={{
				height: "100vh",
				width: "100%",
				position: "sticky",
				top: 0,
			}}
		>
			<Layer type="symbol" id="marker" layout={{ "icon-image": "circle-15", "icon-size": 1.5 }}>
				{nursingHomes.map((nursingHome, index) => (
					<Feature
						key={`${index}:${nursingHome.name}`}
						coordinates={nursingHome.geolocation.center}
						onMouseEnter={() => setPopup({ center: nursingHome.geolocation.center, nursingHome })}
						onMouseLeave={() => setPopup(null)}
					/>
				))}
			</Layer>

			{popup ? (
				<Popup
					coordinates={popup.center}
					offset={{
						"bottom-left": [12, -38],
						bottom: [0, -38],
						"bottom-right": [-12, -38],
					}}
				>
					<NursingHomeSmall nursinghome={popup.nursingHome} isNarrow={true} />
				</Popup>
			) : (
				<Layer />
			)}
		</MapComponent>
	);
};

export default React.memo(Map);

interface PropsMapSmall {
	nursingHome: NursingHome;
}

export const MapSmall: FC<PropsMapSmall> = ({ nursingHome }) => (
	<MapComponent
		/* eslint-disable-next-line react/style-prop-object */
		style="mapbox://styles/mapbox/streets-v9"
		center={nursingHome.geolocation.center}
		containerStyle={{
			height: "200px",
			width: "100%",
		}}
	>
		<Layer type="symbol" id="marker" layout={{ "icon-image": "circle-15", "icon-size": 1.5 }}>
			<Feature coordinates={nursingHome.geolocation.center} />
		</Layer>
	</MapComponent>
);
