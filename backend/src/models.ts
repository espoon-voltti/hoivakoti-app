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

interface NurseryHome{
		name: string,
		owner: string,
		address: string,
		location: string,
		ara?: boolean,
		www?: string
}

knex.schema.hasTable("NurseryHomes").then(async (exists: boolean) => {

	if (exists)
		await knex.schema.dropTable("NurseryHomes")

	//var count = await knex('pg_class').select("reltuples").where({relname: "NurseryHomes"});
	//console.log(count);

	knex.schema.createTable("NurseryHomes", (table: any) => {
		table.uuid("id")
		table.string("name")
		table.string("owner")
		table.string("address")
		table.string("location")
		table.boolean("ara")
		table.string("www")
	}).then(async () => {
		//const id = await InsertNurseryHomeToDB("Leppävaaran Hoiva ja Turva", "Puutteita hoitohenkilökunnan määrässä; vakava vesivahinko; ikkunat eristämättömiä. Ruoka hyvää, suosittelen!");
		//await InsertNurseryHomeToDB("Vaikea Hoivakoti Ry", "Kaikki tarkastukset tip-top. Tosi hyvä pössis. Ruoka vähän mautonta, en suosittele muuttoa.");
		//await InsertNurseryHomeToDB("Kaskissalmen Puutarha", "Rakenteista puuttuu muunmuassa katto ja seinät. Oma teltta oltava mukana. HUOM! Puutiaisaivokuumetta havaittu!");

		//await SetUpRatingsTable(id);

		console.log("Created Nursery table.")
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

		//var count = await knex('pg_class').select("reltuples").where({relname: "NurseryHomes"});
		//console.log(count);

		knex.schema.createTable("Ratings", (table: any) => {
			table.uuid("id")
			table.uuid("nurseryhome")
			table.integer("time")
			table.string("ip")
			table.integer("rating")
		}).then(async () => {
			console.log("Created Ratings table.")

			await InsertNurseryHomeRatingToDB(id_for_testing, 2)
		})

		/*.catch((err: any) => { console.log(err); throw err })
			.finally(() => {
				knex.destroy();
		});*/
	})
}

async function InsertNurseryHomeToDB(nurseryhome: NurseryHome)
{
	const uuid = uuidv4()
	await knex("NurseryHomes").insert({id: uuid,
		name: nurseryhome.name,
		owner: nurseryhome.owner,
		address: nurseryhome.address,
		location: nurseryhome.location,
		www: nurseryhome.www,
		ara: nurseryhome.ara})
	await SetUpRatingsTable(uuid)

	return uuid
}

async function InsertNurseryHomeRatingToDB(nursery_id: string, rating: number)
{
	const uuid = uuidv4()
	const seconds = Math.round(new Date().getTime() / 1000)
	await knex("Ratings").insert({id: uuid, nurseryhome: nursery_id, time: seconds, rating: rating})

	return uuid
}

async function GetAllNurseryHomes()
{
	return await knex.select().table("NurseryHomes")
}

async function GetAllRatings()
{
	return await knex.select().table("Ratings")
}

export {
	InsertNurseryHomeToDB,
	GetAllNurseryHomes,
	GetAllRatings}