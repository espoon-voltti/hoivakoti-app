/* eslint-disable @typescript-eslint/camelcase */
import React, { FC } from "react";
import ReactMapboxGl, { Popup, Marker, ZoomControl } from "react-mapbox-gl";
import { NursingHomeSmall } from "./NursingHomeSmall";
import { NursingHome } from "./types";
import "../styles/Map.scss";
import { FactoryParameters } from "react-mapbox-gl/lib/map";

interface Props {
	nursingHomes: NursingHome[];
	popup: { selectedNursingHome: NursingHome; isExpanded: boolean } | null;
	onSelectNursingHome: (nursingHome: NursingHome | null) => void;
}

const mapConfig: FactoryParameters = {
	accessToken:
		"pk.eyJ1IjoidHphZXJ1LXJlYWt0b3IiLCJhIjoiY2sxZzIxazd0MHg0eDNubzV5Mm41MnJzdCJ9.vPaqUY1S8qHgfzwHUuYUcg",
	scrollZoom: false,
	dragRotate: false,
	pitchWithRotate: false,
};

const mapConfigNonInteractive: FactoryParameters = {
	...mapConfig,
	interactive: false,
};

const MapComponent = ReactMapboxGl(mapConfig);
const MapComponentNonInteractive = ReactMapboxGl(mapConfigNonInteractive);

const Map: FC<Props> = ({ nursingHomes, popup, onSelectNursingHome }) => {
	const createMarkerClickHandler = (nursingHome: NursingHome) => () => {
		if (popup && popup.selectedNursingHome.id === nursingHome.id)
			onSelectNursingHome(null);
		else onSelectNursingHome(nursingHome);
	};

	const selectedMarkerPos =
		popup && popup.isExpanded
			? popup.selectedNursingHome.geolocation.center
			: null;
	const center: [number, number] = selectedMarkerPos
		? [selectedMarkerPos[0], selectedMarkerPos[1] + 0.02]
		: [24.6559, 60.2055];

	return (
		<MapComponent
			/* eslint-disable-next-line react/style-prop-object */
			style="mapbox://styles/mapbox/streets-v9"
			center={center}
			containerStyle={{
				height: "100vh",
				width: "100%",
				position: "sticky",
				top: 0,
			}}
			onClick={() => onSelectNursingHome(null)}
		>
			<ZoomControl position="top-right" />

			<>
				{nursingHomes.map((nursingHome, index) => (
					<Marker
						key={`${index}:${nursingHome.name}`}
						coordinates={nursingHome.geolocation.center}
						onClick={createMarkerClickHandler(nursingHome)}
						style={{ cursor: "pointer" }}
					>
						<img
							src={`/icon-location${
								popup &&
								popup.selectedNursingHome.id === nursingHome.id
									? "-selected"
									: ""
							}.svg`}
							alt="Hoivakoti kartalla"
						/>
					</Marker>
				))}
			</>

			<>
				{popup && popup.isExpanded && (
					<Popup
						coordinates={
							popup.selectedNursingHome.geolocation.center
						}
						anchor="bottom"
						offset={{
							"bottom-left": [12, -38],
							bottom: [0, -38],
							"bottom-right": [-12, -38],
						}}
					>
						<NursingHomeSmall
							nursinghome={popup.selectedNursingHome}
							isNarrow={true}
						/>
					</Popup>
				)}
			</>
		</MapComponent>
	);
};

export default React.memo(Map);

interface PropsMapSmall {
	nursingHome: NursingHome;
}

export const MapSmall: FC<PropsMapSmall> = ({ nursingHome }) => (
	<MapComponentNonInteractive
		/* eslint-disable-next-line react/style-prop-object */
		style="mapbox://styles/mapbox/streets-v9"
		center={nursingHome.geolocation.center}
		containerStyle={{
			height: "200px",
			width: "100%",
		}}
		zoom={[14]}
	>
		<Marker coordinates={nursingHome.geolocation.center}>
			<img src="/icon-location-selected.svg" alt="Hoivakoti kartalla" />
		</Marker>
	</MapComponentNonInteractive>
);
