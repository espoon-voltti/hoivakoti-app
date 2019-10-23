import {
	InsertNursingHomeToDB,
	GetAllNursingHomes,
	GetAllRatings,
	GetNursingHome as GetNursingHomeDB} from "./models"

import {
	NursingHomesFromCSV} from "./services"

async function AddNursingHome(ctx: any)
{
	await InsertNursingHomeToDB({name: ctx.request.body.name,
		owner: ctx.request.body.name,
		address: ctx.request.body.address,
		location: ctx.request.body.location})
	return "inserted"
}

async function ListNursingHomes(ctx: any)
{
	const nursing_homes = await GetAllNursingHomes()
	return nursing_homes
}

async function GetNursingHome(ctx: any)
{
	return await GetNursingHomeDB(ctx.params.id);
}

async function ListRatings(ctx: any)
{
	const ratings = await GetAllRatings()

	let ratings_as_object: any = {}

	ratings.forEach((rating: any) =>
	{
		const id = rating.nursinghome

		if (!(id in ratings_as_object))
		{
			ratings_as_object[id] = {}
			ratings_as_object[id].total = 0	
			ratings_as_object[id].avg = 0
		}

		ratings_as_object[id].total += 1
		ratings_as_object[id].avg += rating.rating

		console.log(rating)
	})

	for (var key in ratings_as_object)
		ratings_as_object[key].avg = ratings_as_object[key].avg/ratings_as_object[key].total

	console.log(ratings_as_object)

	return ratings_as_object
}

async function AddNursingHomesFromCSV(ctx: any)
{
	const csv: string = ctx.request.body.csv

	const records = await NursingHomesFromCSV(csv)

	return (records)
}

export {
	AddNursingHome,
	ListNursingHomes,
	ListRatings,
	AddNursingHomesFromCSV,
	GetNursingHome}