import * as Knex from "knex"
import * as uuidv4 from "uuid/v4"
import * as rp from "request-promise-native"
import fs = require("fs");
import {NursingHome} from "./nursinghome-typings"

import {
	NursingHomesFromCSV} from "./services"

const options: object = {
	client: "postgres",
	connection: {
		user: process.env.DB_URL ? "voltti" : "postgres",
		password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "postgres",
		host: process.env.DB_URL ? process.env.DB_URL : "postgres",
		database: process.env.DB_URL ? "postgres" : "postgres",
	}
}
const knex = new (Knex as any)(options)

knex.schema.hasTable("NursingHomes").then(async (exists: boolean) => {

	if (exists)
		return;

	//var count = await knex('pg_class').select("reltuples").where({relname: "NursingHomes"});
	//console.log(count);

	await CreateNursingHomeTable();
	
	/*.catch((err: any) => { console.log(err); throw err })
		.finally(() => {
			knex.destroy();
	});*/
})

async function CreateNursingHomeTable()
{
	await knex.schema.createTable("NursingHomes", (table: any) => {
		table.uuid("id")
		table.string("name")
		table.string("owner")
		table.string("address")
		table.boolean("ara")
		table.string("www")
		table.integer("apartment_count")
		table.string("language")
		table.boolean("lah")
		table.text("summary")
		table.string("postal_code")
		table.string("city")
		table.text("arrival_guide_public_transit")
		table.text("arrival_guide_car")
		table.integer("construction_year")
		table.text("building_info")
		table.boolean("apartments_have_bathroom")
		table.text("apartment_count_info")
		table.float("apartment_square_meters")
		table.float("rent")
		table.text("rent_info")
		table.text("language_info")
		table.string("menu_link")
		table.text("meals_preparation")
		table.text("meals_info")
		table.text("activities_info")
		table.text("activities_link")
		table.text("outdoors_possibilities_info")
		table.text("outdoors_possibilities_link")
		table.text("tour_info")
		table.string("contact_name")
		table.string("contact_title")
		table.string("contact_phone")
		table.text("contact_phone_info")
		table.string("email")
		table.text("accessibility_info")
		table.text("staff_info")
		table.text("staff_satisfaction_info")
		table.text("other_services")
		table.text("nearby_services")
		table.json("geolocation")
	})
}

export async function DropAndRecreateNursingHomeTable()
{
	const exists = await knex.schema.hasTable("NursingHomes");
	if (exists)
		await knex.schema.dropTable("NursingHomes");
	const result = await CreateNursingHomeTable();
	return result;
}

async function SetUpRatingsTable(id_for_testing: string)
{
	knex.schema.hasTable("Ratings").then(async (exists: boolean) => {

		if (exists)
			await knex.schema.dropTable("Ratings")

		//var count = await knex('pg_class').select("reltuples").where({relname: "NursingHomes"});
		//console.log(count);

		knex.schema.createTable("Ratings", (table: any) => {
			table.uuid("id")
			table.uuid("nurseryhome")
			table.integer("time")
			table.string("ip")
			table.integer("rating")
		}).then(async () => {
			console.debug("Created Ratings table.")

			//await InsertNursingHomeRatingToDB(id_for_testing, 2)
		})

		/*.catch((err: any) => { console.log(err); throw err })
			.finally(() => {
				knex.destroy();
		});*/
	})
}

export async function InsertNursingHomeToDB(nurseryhome: NursingHome)
{
	// Prolly should not do in models but WIP / MVP
	const geo_query = [nurseryhome.address, nurseryhome.city, "Finland"];
	const geoloc = JSON.parse(await rp("https://api.mapbox.com/geocoding/v5/mapbox.places/Rajamännynahde 6, Espoo, Finland.json?access_token=pk.eyJ1IjoidHphZXJ1LXJlYWt0b3IiLCJhIjoiY2sxZzIxazd0MHg0eDNubzV5Mm41MnJzdCJ9.vPaqUY1S8qHgfzwHUuYUcg"));

	const uuid = uuidv4()
	await knex("NursingHomes").insert({id: uuid,
		...nurseryhome,
		geolocation: geoloc["features"][0]
	})
	//await SetUpRatingsTable(uuid)

	return uuid
}

export async function InsertNursingHomeRatingToDB(nursery_id: string, rating: number)
{
	const uuid = uuidv4()
	const seconds = Math.round(new Date().getTime() / 1000)
	await knex("Ratings").insert({id: uuid, nurseryhome: nursery_id, time: seconds, rating: rating})

	return uuid
}

export async function GetAllNursingHomes()
{
	return await knex.select().table("NursingHomes")
}

export async function GetAllRatings()
{
	return await knex.select().table("Ratings")
}

export async function GetNursingHome(id: string)
{
	const result = await knex.select().table("NursingHomes").where({id: id});
	return result;
}

export async function DeleteAllNursingHomes()
{
	const result = await knex.select().table("NursingHomes").del();
	return result;
}