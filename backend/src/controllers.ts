import {
	InsertNurseryHomeToDB,
	GetAllNurseryHomes,
	GetAllRatings} from "./models";

const parse = require('csv-parse/lib/sync')

async function AddNursingHome(ctx: any)
{
	await InsertNurseryHomeToDB({name: ctx.request.body.name,
		owner: ctx.request.body.name,
		address: ctx.request.body.address,
		location: ctx.request.body.location});
	return "inserted";
}

async function ListNursingHomes(ctx: any)
{
	const nursery_homes = await GetAllNurseryHomes();
	return nursery_homes;
}

async function ListRatings(ctx: any)
{
	const ratings = await GetAllRatings();

	let ratings_as_object: any = {};

	ratings.forEach((rating: any) =>
	{
		const id = rating.nurseryhome;

		if (!(id in ratings_as_object))
		{
			ratings_as_object[id] = {};
			ratings_as_object[id].total = 0;
			ratings_as_object[id].avg = 0;
		}

		ratings_as_object[id].total += 1;
		ratings_as_object[id].avg += rating.rating;

		console.log(rating)
	})

	for (var key in ratings_as_object)
		ratings_as_object[key].avg = ratings_as_object[key].avg/ratings_as_object[key].total

	console.log(ratings_as_object);

	return ratings_as_object;
}

async function NursingHomesFromCSV(ctx: any)
{
	const records = parse(ctx.request.body.csv, {
		columns: true,
		skip_empty_lines: true,
		skip_lines_with_empty_values: true,
		delimiter: ';'
	})

	records.map(async (record: any) =>
	{
		await InsertNurseryHomeToDB({name: record.Hoivakoti,
			owner: record.Yritys,
			address: record.Katuosoite,
			location: record.Alue,
			www: record.www,
			ara: record.ARA ? record.ARA : false
		});
	});

	return (records)
}

export {
	AddNursingHome,
	ListNursingHomes,
	ListRatings,
	NursingHomesFromCSV};