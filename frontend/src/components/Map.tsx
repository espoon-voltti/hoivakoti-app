/* eslint-disable @typescript-eslint/camelcase */
import React, { FC, useState } from "react";
import ReactMapboxGl, { Popup, Marker, ZoomControl } from "react-mapbox-gl";
import { CardNursingHome } from "./CardNursingHome";
import { NursingHome } from "./types";
import "../styles/Map.scss";
import { FactoryParameters, FitBounds } from "react-mapbox-gl/lib/map";
import { LngLatBounds, LngLat } from "mapbox-gl";

interface Props {
	nursingHomes: NursingHome[] | null;
	popup: { selectedNursingHome: NursingHome; isExpanded: boolean } | null;
	onSelectNursingHome: (nursingHome: NursingHome | null) => void;
}

const mapConfig: FactoryParameters = {
	accessToken:
		"pk.eyJ1IjoidHphZXJ1LXJlYWt0b3IiLCJhIjoiY2sxZzIxazd0MHg0eDNubzV5Mm41MnJzdCJ9.vPaqUY1S8qHgfzwHUuYUcg",
	scrollZoom: false,
	dragRotate: false,
	pitchWithRotate: false,
	maxZoom: 17,
};

const mapConfigNonInteractive: FactoryParameters = {
	...mapConfig,
	interactive: false,
};

const MapComponent = ReactMapboxGl(mapConfig);
const MapComponentNonInteractive = ReactMapboxGl(mapConfigNonInteractive);

const calculateBounds = (
	nursingHomes: NursingHome[] | null,
): FitBounds | null => {
	if (!nursingHomes || nursingHomes.length === 0) return null;

	const bounds = new LngLatBounds();

	for (const nursingHome of nursingHomes) {
		const [lng, lat] = nursingHome.geolocation.center;
		bounds.extend(new LngLat(lng, lat));
	}

	return [
		[bounds.getWest(), bounds.getSouth()],
		[bounds.getEast(), bounds.getNorth()],
	];
};

const Map: FC<Props> = ({ nursingHomes, popup, onSelectNursingHome }) => {
	const [isMapLoaded, setIsMapLoaded] = useState(false);
	const [viewportPos, setViewportPos] = useState<[number, number]>([
		24.6559,
		60.2055,
	]);
	const [updateBounding, setUpdateBounding] = useState(true);

	React.useEffect(() => {
		setUpdateBounding(true);
	}, [nursingHomes]);

	const createMarkerClickHandler = (nursingHome: NursingHome) => () => {
		const [lat, lng] = nursingHome.geolocation.center;
		if (popup && popup.selectedNursingHome.id === nursingHome.id)
			onSelectNursingHome(null);
		else onSelectNursingHome(nursingHome);
		if (isMapLoaded) setViewportPos([lat, lng]);
	};

	const fitBounds = calculateBounds(nursingHomes) || [
		[24.318755, 60.189911],
		[24.742739, 60.416317],
	];

	return (
		<MapComponent
			/* eslint-disable-next-line react/style-prop-object */
			style="mapbox://styles/mapbox/streets-v9"
			center={viewportPos}
			containerStyle={{
				height: "100vh",
				width: "100%",
				position: "sticky",
				top: 0,
			}}
			// Used to disable heavy'ish map changing when filtered nursinghomes changes
			fitBounds={updateBounding ? fitBounds : undefined}
			//fitBounds={shouldUpdateBounding ? fitBounds : fitBounds}
			fitBoundsOptions={{ padding: 100 }}
			onClick={() => onSelectNursingHome(null)}
			onMoveEnd={map => {
				const { lat, lng } = map.getCenter();
				if (isMapLoaded) setViewportPos([lat, lng]);
				setUpdateBounding(false);
			}}
			onStyleLoad={() => {
				setIsMapLoaded(true);
			}}
		>
			<ZoomControl
				position="top-right"
				className="ZoomControl--hoivakoti"
			/>

			<>
				{(nursingHomes || []).map((nursingHome, index) => (
					<Marker
						key={`${index}:${nursingHome.name}`}
						coordinates={nursingHome.geolocation.center}
						onClick={createMarkerClickHandler(nursingHome)}
						style={{ cursor: "pointer" }}
					>
						<img
							src={`/icons/icon-location${
								popup &&
								popup.selectedNursingHome.id === nursingHome.id
									? "-selected"
									: ""
							}.svg`}
							alt={nursingHome.name}
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
						offset={[0, -38]}
						style={{ maxWidth: 350 }}
					>
						<CardNursingHome
							nursinghome={popup.selectedNursingHome}
							className="card-narrow"
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
		<Marker
			coordinates={nursingHome.geolocation.center}
			style={{ zIndex: 1 }}
		>
			<img
				src="/icons/icon-location-selected.svg"
				alt={nursingHome.name}
			/>
		</Marker>
	</MapComponentNonInteractive>
);
