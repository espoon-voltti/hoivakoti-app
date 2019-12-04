/* eslint-disable @typescript-eslint/no-use-before-define */
import Knex, { CreateTableBuilder } from "knex";
import uuidv4 from "uuid/v4";
import rp from "request-promise-native";
import {
	NursingHome,
	nursing_home_pictures_columns_info,
	postal_code_to_district,
} from "./nursinghome-typings";
import config from "./config";
import { createBasicUpdateKey, hashWithSalt } from "./services";

const options: Knex.Config = {
	client: "postgres",
	connection: {
		user: config.pgUser,
		password: config.pgPassword,
		host: config.pgHost,
		database: config.pgDatabaseName,
	},
};
const knex = Knex(options);

knex.schema.hasTable("NursingHomes").then(async (exists: boolean) => {
	if (exists) return;

	await CreateNursingHomeTable();
});

knex.schema.hasTable("NursingHomePictures").then(async (exists: boolean) => {
	if (exists) return;

	//if (exists)
	//	await knex.schema.dropTable("NursingHomePictures");

	await CreateNursingHomePicturesTable();
});

async function CreateNursingHomePicturesTable(): Promise<void> {
	await knex.schema.createTable("NursingHomePictures", (table: any) => {
		nursing_home_pictures_columns_info.map((row_info: any) => {
			if (row_info.sql.includes("caption")) {
				table.string(row_info.sql);
				console.log("Setting string row: " + row_info.sql);
			} else {
				table.binary(row_info.sql);
				table.string(row_info.sql + "_hash");
				console.log("Setting binary row: " + row_info.sql);
			}
		});
		table.string("nursinghome_id");
	});
}

async function CreateNursingHomeTable(): Promise<void> {
	await knex.schema.createTable(
		"NursingHomes",
		(table: CreateTableBuilder) => {
			table.string("id");
			table.string("name");
			table.string("owner");
			table.string("address");
			table.boolean("ara");
			table.string("www");
			table.integer("apartment_count");
			table.string("language");
			table.boolean("lah");
			table.text("summary");
			table.string("postal_code");
			table.string("city");
			table.text("arrival_guide_public_transit");
			table.text("arrival_guide_car");
			table.integer("construction_year");
			table.text("building_info");
			table.boolean("apartments_have_bathroom");
			table.text("apartment_count_info");
			table.string("apartment_square_meters");
			table.string("rent");
			table.text("rent_info");
			table.text("language_info");
			table.string("menu_link");
			table.text("meals_preparation");
			table.text("meals_info");
			table.text("activities_info");
			table.text("activities_link");
			table.text("outdoors_possibilities_info");
			table.text("outdoors_possibilities_link");
			table.text("tour_info");
			table.string("contact_name");
			table.string("contact_title");
			table.string("contact_phone");
			table.text("contact_phone_info");
			table.string("email");
			table.text("accessibility_info");
			table.text("staff_info");
			table.text("staff_satisfaction_info");
			table.text("other_services");
			table.text("nearby_services");
			table.json("geolocation");
			table.string("district");
			table.boolean("has_vacancy");
			table.string("vacancy_last_updated_at");
			table.string("basic_update_key");
		},
	);
}

export async function DropAndRecreateNursingHomeTable(): Promise<void> {
	const exists = await knex.schema.hasTable("NursingHomes");
	if (exists) await knex.schema.dropTable("NursingHomes");
	const result = await CreateNursingHomeTable();
	return result;
}

export async function DropAndRecreateNursingHomePicturesTable(): Promise<void> {
	const exists = await knex.schema.hasTable("NursingHomePictures");
	if (exists) await knex.schema.dropTable("NursingHomePictures");
	const result = await CreateNursingHomePicturesTable();
	return result;
}

// async function SetUpRatingsTable(id_for_testing: string) {
// 	knex.schema.hasTable("Ratings").then(async (exists: boolean) => {
// 		if (exists) await knex.schema.dropTable("Ratings");

// 		//var count = await knex('pg_class').select("reltuples").where({relname: "NursingHomes"});
// 		//console.log(count);

// 		knex.schema
// 			.createTable("Ratings", (table: any) => {
// 				table.uuid("id");
// 				table.uuid("nurseryhome");
// 				table.integer("time");
// 				table.string("ip");
// 				table.integer("rating");
// 			})
// 			.then(async () => {
// 				console.debug("Created Ratings table.");

// 				//await InsertNursingHomeRatingToDB(id_for_testing, 2)
// 			});

// 		/*.catch((err: any) => { console.log(err); throw err })
// 			.finally(() => {
// 				knex.destroy();
// 		});*/
// 	});
// }

export async function InsertNursingHomeToDB(
	nursingHome: NursingHome,
): Promise<string> {
	// Prolly should not do in models but WIP / MVP
	const geo_query = [nursingHome.address, nursingHome.city, "Finland"];
	const geoloc = JSON.parse(
		await rp(
			"https://api.mapbox.com/geocoding/v5/mapbox.places/" +
			geo_query +
			".json?access_token=pk.eyJ1IjoidHphZXJ1LXJlYWt0b3IiLCJhIjoiY2sxZzIxazd0MHg0eDNubzV5Mm41MnJzdCJ9.vPaqUY1S8qHgfzwHUuYUcg",
		),
	);

	const existing_id = await GetNursingHomeIDFromName(nursingHome.name);
	// Nursing home with this name already exists
	if (existing_id.length > 0) {
		const uuid = existing_id[0].id;
		await knex("NursingHomes")
			.where({ id: uuid })
			.update({
				...nursingHome,
				geolocation: geoloc["features"][0],
				district: postal_code_to_district[nursingHome.postal_code],
			});

		return uuid;
	} else {
		const uuid = hashWithSalt(
			nursingHome.name,
			nursingHome.postal_code,
		).slice(0, 10);
		//const basicUpdateKey = createBasicUpdateKey(6);
		const basicUpdateKey = hashWithSalt(
			uuid,
			process.env.ADMIN_PASSWORD as string,
		).slice(0, 10);
		await knex("NursingHomes").insert({
			id: uuid,
			...nursingHome,
			geolocation: geoloc["features"][0],
			district: postal_code_to_district[nursingHome.postal_code],
			basic_update_key: basicUpdateKey,
		});
		//await SetUpRatingsTable(uuid)

		return uuid;
	}
}

export async function InsertNursingHomeRatingToDB(
	nursery_id: string,
	rating: number,
): Promise<string> {
	const uuid = uuidv4();
	const seconds = Math.round(new Date().getTime() / 1000);
	await knex("Ratings").insert({
		id: uuid,
		nurseryhome: nursery_id,
		time: seconds,
		rating: rating,
	});

	return uuid;
}

export async function GetNursingHomeIDFromName(name: string): Promise<any[]> {
	const result = await knex
		.select("name", "id")
		.table("NursingHomes")
		.where({ name: name });
	return result;
}

export async function GetAllNursingHomes(): Promise<any> {
	return await knex
		.select()
		.table("NursingHomes")
		.orderBy("name");
}

export async function GetAllRatings(): Promise<Knex.Table> {
	return await knex.select().table("Ratings");
}

export async function GetNursingHome(id: string): Promise<any[]> {
	const result = await knex
		.select()
		.table("NursingHomes")
		.where({ id: id });

	return result;
}

export async function DeleteAllNursingHomes(): Promise<number> {
	const result = await knex
		.select()
		.table("NursingHomes")
		.del();
	return result;
}

export async function AddPicturesAndDescriptionsForNursingHome(
	id: string,
	pictures: any,
): Promise<void> {
	await knex("NursingHomePictures").insert({
		nursinghome_id: id,
		...pictures,
	});
}

export async function GetAllPicturesAndDescriptions(): Promise<Knex.Table> {
	return await knex.select().table("NursingHomePictures");
}

export async function GetPicturesAndDescriptions(id: string): Promise<any[]> {
	return await knex
		.select()
		.table("NursingHomePictures")
		.where({ nursinghome_id: id });
}

// Returns data and hash
export async function GetPicData(
	nursinghome_id: string,
	pic: string,
): Promise<any[]> {
	return await knex
		.select(pic, pic + "_hash")
		.table("NursingHomePictures")
		.where({ nursinghome_id: nursinghome_id });
}

export async function GetPicCaptions(nursinghome_id: string): Promise<any[]> {
	const columns = nursing_home_pictures_columns_info
		.filter((row_info: any) => {
			if (row_info.sql.includes("caption")) return true;
			return false;
		})
		.map((row_info: any) => {
			if (row_info.sql.includes("caption")) return row_info.sql;
		});

	return await knex
		.select(columns)
		.table("NursingHomePictures")
		.where({ nursinghome_id: nursinghome_id });
}

export async function GetPicDigests(nursinghome_id: string): Promise<any[]> {
	const columns = nursing_home_pictures_columns_info
		.filter((row_info: any) => {
			if (row_info.sql.includes("caption")) return false;
			return true;
		})
		.map((row_info: any) => {
			if (!row_info.sql.includes("caption"))
				return row_info.sql + "_hash";
		});

	return await knex
		.select(columns)
		.table("NursingHomePictures")
		.where({ nursinghome_id: nursinghome_id });
}

export async function GetAllPicDigests(): Promise<any[]> {
	const columns = nursing_home_pictures_columns_info
		.filter((row_info: any) => {
			if (row_info.sql.includes("caption")) return false;
			return true;
		})
		.map((row_info: any) => {
			if (!row_info.sql.includes("caption"))
				return row_info.sql + "_hash";
		});

	columns.push("nursinghome_id");

	return await knex.select(columns).table("NursingHomePictures");
}

export async function GetDistinctCities(): Promise<any[]> {
	return await knex("NursingHomes").distinct("city");
}

export async function GetNursingHomeVacancyStatus(
	id: string,
	basicUdpateKey: string,
): Promise<{
	has_vacancy: boolean;
	vacancy_last_updated_at: string | null;
} | null> {
	const res = await knex("NursingHomes")
		.where({ id, basic_update_key: basicUdpateKey })
		.select("has_vacancy", "vacancy_last_updated_at");

	if (res.length === 0) return null;

	const status = res[0].has_vacancy === true;
	const { vacancy_last_updated_at } = res[0];
	return { has_vacancy: status, vacancy_last_updated_at };
}

export async function UpdateNursingHomeVacancyStatus(
	id: string,
	basicUdpateKey: string,
	value: boolean,
): Promise<boolean> {
	const now = new Date().toISOString();

	const count = await knex("NursingHomes")
		.where({ id, basic_update_key: basicUdpateKey })
		.update({
			has_vacancy: value,
			vacancy_last_updated_at: now,
		});

	if (count !== 1) return false;

	return true;
}

export interface BasicUpdateKeyEntry {
	id: string;
	basic_update_key: string;
}

export async function GetAllBasicUpdateKeys(): Promise<BasicUpdateKeyEntry[]> {
	const res = await knex("NursingHomes").select("id", "basic_update_key");
	return res.map(({ id, basic_update_key }) => ({ id, basic_update_key }));
}
