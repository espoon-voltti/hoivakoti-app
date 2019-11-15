import {
	InsertNursingHomeToDB,
	GetAllNursingHomes,
	GetAllRatings,
	GetNursingHome as GetNursingHomeDB,
	DeleteAllNursingHomes,
	DropAndRecreateNursingHomeTable} from "./models"

import {
	NursingHomesFromCSV} from "./services"

const fs = require('fs');

//import * as google from "googleapis"
const {google} = require('googleapis');

export async function AddNursingHome(ctx: any)
{
	await InsertNursingHomeToDB({name: ctx.request.body.name,
		owner: ctx.request.body.name,
		address: ctx.request.body.address,
		city: ctx.request.body.city,
		postal_code: ctx.request.body.postal_code
	})
	return "inserted"
}

export async function ListNursingHomes(ctx: any)
{
	const nursing_homes = await GetAllNursingHomes()
	return nursing_homes
}

export async function GetNursingHome(ctx: any)
{
	return await GetNursingHomeDB(ctx.params.id);
}

export async function ListRatings(ctx: any)
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
	})

	for (var key in ratings_as_object)
		ratings_as_object[key].avg = ratings_as_object[key].avg/ratings_as_object[key].total
	
	return ratings_as_object
}

export async function AddNursingHomesFromCSV(ctx: any)
{
	const csv: string = ctx.request.body.csv

	const records = await NursingHomesFromCSV(csv)

	return (records)
}

export async function DeleteNursingHomes(ctx: any)
{
	const result = await DeleteAllNursingHomes();
	return result;
}

export async function DropAndRecreateTables(ctx: any)
{
	const result = await DropAndRecreateNursingHomeTable();
	return result;
}

export async function UploadPics(ctx: any)
{
	const drive = google.drive({
		version: 'v3',
		auth: 'AIzaSyDpM7dvcX4cck9-rRcP3r7nUUVe2pU56kU'
	});
	
	try {
		//const data = await drive.files.get({fileId: "1SvVLVlbjwR6_l1iKv6OEi9f8PXuFXVWz", alt: 'media'}, {responseType: 'stream'});

		var fileId = '1SvVLVlbjwR6_l1iKv6OEi9f8PXuFXVWz';
		await fs.promises.mkdir('./tmp');
		var dest = fs.createWriteStream('./tmp/photo.jpg');
		drive.files..get({fileId, alt: 'media'}, {responseType: 'stream'})
		.then((res: any) => {
		 	return new Promise((resolve, reject) => {
		 		res.data
          .on('end', () => {
            console.log('Done downloading file.');
            resolve('./tmp/photo.jpg');
          })
          .on('error', err: any => {
            console.error('Error downloading file.');
            reject(err);
          })
          .on('data', d => {
            progress += d.length;
            if (process.stdout.isTTY) {
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(`Downloaded ${progress} bytes`);
            }
          })
          .pipe(dest);
      });
    });
	}
	catch (e)
	{
		console.log(e);
	}

	//console.log(ctx.request.files);
	ctx.body = ctx.request.files;
}