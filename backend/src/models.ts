import * as Knex from "knex"
import * as uuidv4 from "uuid/v4"
import fs = require("fs");

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

interface NursingHome{
		name: string,
		owner: string,
		address: string,
		location: string,
		ara?: boolean,
		www?: string,
		apartment_count?: number,
		language?: string,
		lah?: boolean,
}

knex.schema.hasTable("NursingHomes").then(async (exists: boolean) => {

	if (exists)
		await knex.schema.dropTable("NursingHomes")

	//var count = await knex('pg_class').select("reltuples").where({relname: "NursingHomes"});
	//console.log(count);

	knex.schema.createTable("NursingHomes", (table: any) => {
		table.uuid("id")
		table.string("name")
		table.string("owner")
		table.string("address")
		table.string("location")
		table.boolean("ara")
		table.string("www")
		table.integer("apartment_count")
		table.string("language")
		table.boolean("lah")
	}).then(async () => {
		//const id = await InsertNursingHomeToDB("Leppävaaran Hoiva ja Turva", "Puutteita hoitohenkilökunnan määrässä; vakava vesivahinko; ikkunat eristämättömiä. Ruoka hyvää, suosittelen!");
		//await InsertNursingHomeToDB("Vaikea Hoivakoti Ry", "Kaikki tarkastukset tip-top. Tosi hyvä pössis. Ruoka vähän mautonta, en suosittele muuttoa.");
		//await InsertNursingHomeToDB("Kaskissalmen Puutarha", "Rakenteista puuttuu muunmuassa katto ja seinät. Oma teltta oltava mukana. HUOM! Puutiaisaivokuumetta havaittu!");

		//await SetUpRatingsTable(id);

		console.debug("Created Nursing table.")
		const nurseryhome_contents = fs.readFileSync("data/hoivakodit.csv", "utf8")

		await NursingHomesFromCSV(nurseryhome_contents)
	})

	/*.catch((err: any) => { console.log(err); throw err })
		.finally(() => {
			knex.destroy();
	});*/
})

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

async function InsertNursingHomeToDB(nurseryhome: NursingHome)
{
	const uuid = uuidv4()
	await knex("NursingHomes").insert({id: uuid,
		...nurseryhome
	})
	//await SetUpRatingsTable(uuid)

	return uuid
}

async function InsertNursingHomeRatingToDB(nursery_id: string, rating: number)
{
	const uuid = uuidv4()
	const seconds = Math.round(new Date().getTime() / 1000)
	await knex("Ratings").insert({id: uuid, nurseryhome: nursery_id, time: seconds, rating: rating})

	return uuid
}

async function GetAllNursingHomes()
{
	return await knex.select().table("NursingHomes")
}

async function GetAllRatings()
{
	return await knex.select().table("Ratings")
}

async function GetNursingHome(id: string)
{
	const result = await knex.select().table("NursingHomes").where({id: id});
	return result;
}

export {
	InsertNursingHomeToDB,
	GetAllNursingHomes,
	GetAllRatings,
	GetNursingHome}