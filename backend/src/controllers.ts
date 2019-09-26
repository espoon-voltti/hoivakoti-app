import {
	InsertNurseryHomeToDB,
	GetAllNurseryHomes,
	GetAllRatings} from "./models";

async function AddNursingHome(ctx: any)
{
	await InsertNurseryHomeToDB(ctx.request.body.name, ctx.request.body.summary);
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

export {
	AddNursingHome,
	ListNursingHomes,
	ListRatings};