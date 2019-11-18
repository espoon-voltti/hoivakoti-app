// This interface declaration is duplicated in frontend and backend. Please
// modify both at the same time to keep them in sync
export interface NursingHome {
	id: string;
	name: string;
	district: string;
	owner: string;
	address: string;
	ara?: boolean;
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
}
