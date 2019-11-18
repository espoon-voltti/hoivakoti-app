import {
	InsertNursingHomeToDB,
	GetAllNursingHomes,
	GetAllRatings,
	AddPicturesAndDescriptionsForNursingHome,
	GetNursingHomeIDFromName} from "./models"
import {NursingHome, nursing_home_columns_info, nursing_home_pictures_columns_info} from "./nursinghome-typings"

const sharp = require("sharp")

const parse = require("csv-parse/lib/sync")

const fs = require('fs');

//import * as google from "googleapis"
const {google} = require('googleapis');

const crypto = require('crypto')
function checksum(str: string) {
  return crypto
    .createHash('SHA256')
    .update(str)
    .digest('hex')
}

const drive = google.drive({
	version: 'v3',
	auth: 'AIzaSyDpM7dvcX4cck9-rRcP3r7nUUVe2pU56kU'
});


async function NursingHomesFromCSV(csv: string)
{
	const records: object[] = parse(csv, {
		columns: true,
		skip_empty_lines: true,
		skip_lines_with_empty_values: true,
		delimiter: ","
	})

	console.log(records.length);

	records.map(async (record: any) =>
	{
		const nursing_home:any = {};
		nursing_home_columns_info.map((info: any) => {
			if (info.type === "float")
				nursing_home[info.sql] = parseFloat(record[info.csv]);
			else if (info.type === "boolean")
				nursing_home[info.sql] = record[info.csv] ?
					record[info.csv] === "True" ?
						true : false :
					false;
			else
				nursing_home[info.sql] = record[info.csv];
		})
		await InsertNursingHomeToDB(nursing_home as NursingHome)
	})

	return (records)
}

export async function FetchAndSaveImagesFromCSV(csv: string)
{
	const records: any[] = parse(csv, {
		columns: true,
		skip_empty_lines: true,
		skip_lines_with_empty_values: true,
		delimiter: ","
	})

	const pictures:any = [];



	for (const record of records)
	{
		console.log(record);
		const nursinghome_pics:any = {};

		const nursing_home_id = (await GetNursingHomeIDFromName(record["Hoivakodin nimi"]))[0].id
		console.log("ID: " + JSON.stringify(nursing_home_id))

		for (const field_info of nursing_home_pictures_columns_info)
		{
			if (field_info.sql.includes("_caption"))
				nursinghome_pics[field_info.sql] = record[field_info.csv]
			else
			{
				const pic_id = record[field_info.csv].substring(record[field_info.csv].lastIndexOf('=') + 1);
				if (pic_id.length > 0)
				{
					const name = await DownloadAndSaveFile(pic_id);
					console.log(name)
					const file = await fs.promises.readFile(name);
					//nursinghome_pics[field_info.sql] = '\\x' + file;

					const hash = checksum(file);

					nursinghome_pics[field_info.sql] = file;
					nursinghome_pics[field_info.sql + "_hash"] = hash;
					console.log("File: " + name + " Length: " + file.length + " SQL: " + field_info.sql);
				}
			}
		}
		//console.log(nursinghome_pics);
		console.log("Uploaded and read to memory; saving to database.");
		console.log(Object.keys(nursinghome_pics));
		await AddPicturesAndDescriptionsForNursingHome(nursing_home_id, nursinghome_pics);
	}

	return "Wooh"
}

async function 	DownloadAndSaveFile(id:string)
{
	const drive = google.drive({
		version: 'v3',
		auth: 'AIzaSyDpM7dvcX4cck9-rRcP3r7nUUVe2pU56kU'
	});

	try {
		//const data = await drive.files.get({fileId: "1SvVLVlbjwR6_l1iKv6OEi9f8PXuFXVWz", alt: 'media'}, {responseType: 'stream'});

		await fs.promises.mkdir('./tmp', {recursive: true});
		const file_name = './tmp/' + id + ".jpg";
		var dest = fs.createWriteStream(file_name);
		let progress = 0;
		let answer;
		try
		{
			answer = await drive.files.get({fileId: id, alt: 'media'}, {responseType: 'stream'})
			.then((res: any) => {
				return new Promise((resolve, reject) => {
					res.data
		          .on('end', () => {
		            console.debug('Done downloading file.');
		            sharp(file_name)
						.resize(1024)
						.toFile(file_name + "-small", (err:any, info:any) => {resolve(file_name + "-small")});
		          })
		          .on('error', (err: any) => {
		            console.error('Error downloading file.');
		            reject(err);
		          })
		          .on('data', (d: any) => {
		            progress += d.length;
		            if (process.stdout.isTTY) {
		              process.stdout.write(`Downloaded ${progress} bytes`);
		            }
		          })
		          .pipe(dest);
		      });
		    });
		}
		catch (e)
		{

		}
	    return answer;
	}
	catch (e)
	{
		//console.debug(e);
		return (e);
	}
}

export {NursingHomesFromCSV}