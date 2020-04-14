export type NursingHomeImageName =
	| "apartment"
	| "apartment_layout"
	| "bathroom"
	| "dining_room"
	| "entrance"
	| "lounge"
	| "nursinghome_layout"
	| "outside"
	| "overview_outside"
	| "owner_logo";

// This interface declaration is duplicated in frontend and backend. Please
// modify both at the same time to keep them in sync
export interface NursingHome {
	id: string;
	name: string;
	district: string;
	owner: string;
	address: string;
	ara?: string;
	www?: string;
	apartment_count?: number;
	language?: string;
	lah?: boolean;
	summary?: string;
	postal_code: string;
	city: string;
	arrival_guide_public_transit?: string;
	arrival_guide_car?: string;
	construction_year?: number;
	building_info?: string;
	apartments_have_bathroom?: boolean;
	apartment_count_info?: string;
	apartment_square_meters?: string;
	rent?: string;
	rent_info?: string;
	language_info?: string;
	menu_link?: string;
	meals_preparation?: string;
	meals_info?: string;
	activities_info?: string;
	activities_link?: string;
	outdoors_possibilities_info?: string;
	outdoors_possibilities_link?: string;
	tour_info?: string;
	contact_name?: string;
	contact_title?: string;
	contact_phone?: string;
	contact_phone_info?: string;
	email?: string;
	accessibility_info?: string;
	staff_info?: string;
	staff_satisfaction_info?: string;
	other_services?: string;
	nearby_services?: string;
	geolocation: {
		center: [number, number];
	};
	pic_digests: {
		apartment_hash: string | null;
		apartment_layout_hash: string | null;
		bathroom_hash: string | null;
		dining_room_hash: string | null;
		entrance_hash: string | null;
		lounge_hash: string | null;
		nursinghome_layout_hash: string | null;
		outside_hash: string | null;
		overview_outside_hash: string | null;
		owner_logo_hash: string | null;
	};
	pics: NursingHomeImageName[];
	pic_captions: {
		apartment_hash: string | null;
		apartment_layout_hash: string | null;
		bathroom_hash: string | null;
		dining_room_hash: string | null;
		entrance_hash: string | null;
		lounge_hash: string | null;
		nursinghome_layout_hash: string | null;
		outside_hash: string | null;
		overview_outside_hash: string | null;
		owner_logo_hash: string | null;
	};
	report_status: {
		status: string;
		date: string;
	}
	has_vacancy: boolean | null;
	rating: {
		average: number | null;
		answers: number | null;
	}
	
}
