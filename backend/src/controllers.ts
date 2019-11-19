import {
	InsertNursingHomeToDB,
	GetAllNursingHomes,
	// GetAllRatings,
	GetNursingHome as GetNursingHomeDB,
	DeleteAllNursingHomes,
	DropAndRecreateNursingHomeTable,
	DropAndRecreateNursingHomePicturesTable,
	GetAllPicturesAndDescriptions,
	GetPicturesAndDescriptions,
	GetPicData,
	GetPicCaptions,
	GetPicDigests,
	GetAllPicDigests,
	GetDistinctCities
} from "./models";

import { NursingHomesFromCSV, FetchAndSaveImagesFromCSV } from "./services";
import Knex = require("knex");

export async function AddNursingHome(ctx: any): Promise<string> {
	await InsertNursingHomeToDB({
		name: ctx.request.body.name,
		owner: ctx.request.body.name,
		address: ctx.request.body.address,
		city: ctx.request.body.city,
		postal_code: ctx.request.body.postal_code,
	});
	return "inserted";
}

export async function ListNursingHomes(ctx: any): Promise<Knex.Table> {
	const nursing_homes = await GetAllNursingHomes();

	const pic_digests = await GetAllPicDigests();
	/*const available_pics = Object.keys(pic_digests)
		.filter((item: any) => (pic_digests[item] != null ? true : false))
		.map((item: any) => item.replace("_hash", ""));*/
	//nursing_homes[0].digests = pic_digests;
	nursing_homes.map((nursinghome: any) => {
		nursinghome.pic_digests = {};
		nursinghome.pics = [];
		pic_digests.map((digests: any) => {
			if (digests.nursinghome_id === nursinghome.id) {
				nursinghome.pic_digests = digests;

				const available_pics = Object.keys(digests)
					.filter((item: any) =>
						digests[item] != null ? true : false,
					)
					.map((item: any) => item.replace("_hash", ""));
				nursinghome.pics = available_pics;
			}
		});
	});

	return nursing_homes;
}

export async function GetNursingHome(ctx: any): Promise<any> {
	const nursing_home_data = (await GetNursingHomeDB(ctx.params.id))[0];
	const pic_digests = (await GetPicDigests(ctx.params.id))[0];
	const available_pics = pic_digests;
	Object.keys(pic_digests || {})
		.filter((item: any) => (pic_digests[item] != null ? true : false))
		.map((item: any) => item.replace("_hash", ""));

	nursing_home_data["pic_digests"] = pic_digests;
	nursing_home_data["pics"] = available_pics;
	return nursing_home_data;
}

// export async function ListRatings(ctx: any): Promise<any> {
// 	const ratings = await GetAllRatings();

// 	let ratings_as_object: any = {};

// 	ratings.forEach((rating: any) => {
// 		const id = rating.nursinghome;

// 		if (!(id in ratings_as_object)) {
// 			ratings_as_object[id] = {};
// 			ratings_as_object[id].total = 0;
// 			ratings_as_object[id].avg = 0;
// 		}

// 		ratings_as_object[id].total += 1;
// 		ratings_as_object[id].avg += rating.rating;
// 	});

// 	for (var key in ratings_as_object)
// 		ratings_as_object[key].avg = ratings_as_object[key].avg / ratings_as_object[key].total;

// 	return ratings_as_object;
// }

export async function AddNursingHomesFromCSV(ctx: any): Promise<object[]> {
	const csv: string = ctx.request.body.csv;

	const records = await NursingHomesFromCSV(csv);

	return records;
}

export async function DeleteNursingHomes(ctx: any): Promise<number> {
	const result = await DeleteAllNursingHomes();
	return result;
}

export async function DropAndRecreateTables(ctx: any): Promise<void> {
	const result1 = await DropAndRecreateNursingHomeTable();
	const result2 = await DropAndRecreateNursingHomePicturesTable();
	return result1;
}

export async function UploadPics(ctx: any): Promise<string> {
	const csv: string = ctx.request.body.csv;

	const result = await FetchAndSaveImagesFromCSV(csv);

	return result;
}

export async function GetAllPicsAndDescriptions(ctx: any): Promise<Knex.Table> {
	return await GetAllPicturesAndDescriptions();
}

export async function GetPicsAndDescriptions(ctx: any): Promise<any[]> {
	return await GetPicturesAndDescriptions(ctx.params.id);
}

export async function GetPic(ctx: any): Promise<any> {
	const pic_and_hash = (await GetPicData(ctx.params.id, ctx.params.pic))[0];
	const pic_data = pic_and_hash[ctx.params.pic];
	if (pic_data) {
		ctx.response.set("Content-Type", "image/jpeg");
		ctx.response.set("Content-Length", pic_data.length);
		ctx.response.set(
			"Digest",
			"sha-256=" + pic_and_hash[ctx.params.pic + "_hash"],
		);
		if (ctx.params.digest)
			ctx.response.set(
				"Cache-Control",
				"public,max-age=31536000,immutable",
			);

		return pic_data;
	} else {
		// eslint-disable-next-line require-atomic-updates
		ctx.response.status = 404;
		return "No image found";
	}
}

export async function GetCaptions(ctx: any): Promise<any> {
	const captions = (await GetPicCaptions(ctx.params.id))[0];
	return captions;
}

export async function GetCities(ctx: any): Promise<any> {
	const cities = await GetDistinctCities();
	return cities.map((item: any) => item.city);
}