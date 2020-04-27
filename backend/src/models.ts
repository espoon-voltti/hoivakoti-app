/* eslint-disable @typescript-eslint/no-use-before-define */
import Knex, { CreateTableBuilder } from "knex";
import uuidv4 from "uuid/v4";
import rp from "request-promise-native";
import crypto, { BinaryLike } from "crypto";
import {
	NursingHome,
	nursing_home_pictures_columns_info,
	postal_code_to_district,
} from "./nursinghome-typings";
import config from "./config";
import { createBasicUpdateKey, hashWithSalt, NursingHomesFromCSV, validNumericSurveyScore, createSurveyKey } from "./services";
import sharp from "sharp";

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
	await addDummyNursingHome();
});

knex.schema.hasTable("NursingHomePictures").then(async (exists: boolean) => {
	if (exists) return;

	//if (exists)
	//	await knex.schema.dropTable("NursingHomePictures");

	await CreateNursingHomePicturesTable();
});

knex.schema.hasTable("NursingHomeReports").then(async (exists: boolean) => {
	if (exists) return;

	await CreateNursingHomeReportsTable();
});

knex.schema.hasTable("NursingHomeSurveyQuestions").then(async (exists: boolean) => {
	if (exists) return;

	await CreateNursingHomeSurveyQuestionsTable();
});

knex.schema.hasTable("NursingHomeSurveyAnswers").then(async (exists: boolean) => {
	if (exists) return;

	await CreateNursingHomeSurveyAnswersTable();

});

knex.schema.hasTable("NursingHomeSurveyScores").then(async (exists: boolean) => {
	if (exists) return;

	await CreateNursingHomeSurveyScoresTable();

});

knex.schema.hasTable("NursingHomeSurveyTotalScores").then(async (exists: boolean) => {
	if (exists) return;

	await CreateNursingHomeSurveyTotalScoresTable();

});

knex.schema.hasTable("NursingHomeSurveyKeys").then(async (exists: boolean) => {
	if (exists) return;

	await CreateNursingHomeSurveyKeysTable();

});

knex.schema.hasTable("AdminSessions").then(async (exists: boolean) => {
	if (exists) return;

	await CreateAdminSessionsTable();
});

function checksum(str: string | BinaryLike): string {
	return crypto
		.createHash("SHA256")
		.update(str)
		.digest("hex");
}

async function resizeImage (image:  Buffer){
	return await sharp(image)
			.resize(900, 900, {
				fit: sharp.fit.inside,
				withoutEnlargement: true
			  })
			.jpeg({quality: 90})
			.toBuffer();
}

async function CreateNursingHomePicturesTable(): Promise<void> {
	await knex.schema.createTable("NursingHomePictures", (table: any) => {
		nursing_home_pictures_columns_info.map((row_info: any) => {
			if (row_info.sql.includes("caption")) {
				table.string(row_info.sql);
				console.log("Setting string row: " + row_info.sql);
			} else {
				table.binary(row_info.sql);
				table.string(row_info.sql + "_hash");
				table.string(row_info.sql + "_drive_id");
				console.log("Setting binary row: " + row_info.sql);
			}
		});
		table.string("nursinghome_id");
	});
}

async function CreateNursingHomeReportsTable(): Promise<void> {
	await knex.schema.createTable("NursingHomeReports", (table: any) => {
		
		table.string("nursinghome_id");
		table.string("date")
		table.string("status")
		table.binary("report_file");
		
	});
}

async function CreateAdminSessionsTable(): Promise<void> {
	await knex.schema.createTable("AdminSessions", (table: any) => {
		
		table.string("hash");
		table.string("date");

	});
}

async function CreateNursingHomeSurveyQuestionsTable(): Promise<void> {
	await knex.schema.createTable("NursingHomeSurveyQuestions", (table: any) => {
		
		table.increments("id");
		table.string("survey_id");
		table.integer("order");
		table.boolean("active");
		table.string("question_type");
		table.string("question");
		table.string("question_description");

	});
}

async function CreateNursingHomeSurveyAnswersTable(): Promise<void> {
	await knex.schema.createTable("NursingHomeSurveyAnswers", (table: any) => {
		
		table.increments("id");
		table.string("survey_id");
		table.integer("question_id");
		table.string("nursinghome_id");
		table.string("answer");
		table.string("date");

	});
}

async function CreateNursingHomeSurveyScoresTable(): Promise<void> {
	await knex.schema.createTable("NursingHomeSurveyScores", (table: any) => {
		table.integer("question_id");
		table.string("nursinghome_id");		
		table.integer("answers");
		table.float("average");

	});
}


async function CreateNursingHomeSurveyTotalScoresTable(): Promise<void> {
	await knex.schema.createTable("NursingHomeSurveyTotalScores", (table: any) => {
		table.string("nursinghome_id");	
		table.float("average");
		table.integer("answers");
	});
}

async function CreateNursingHomeSurveyKeysTable(): Promise<void> {
	await knex.schema.createTable("NursingHomeSurveyKeys", (table: any) => {
		table.string("key");	
		table.string("status");
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
			table.string("ara");
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

export async function DropAndRecreateNursingHomeSurveyAnswersTable(): Promise<void> {
	const exists = await knex.schema.hasTable("NursingHomeSurveyAnswers");
	if (exists) await knex.schema.dropTable("NursingHomeSurveyAnswers");
	const result = await CreateNursingHomeSurveyAnswersTable();
	return result;
}

export async function DropAndRecreateNursingHomeSurveyScoresTable(): Promise<void> {
	const exists = await knex.schema.hasTable("NursingHomeSurveyScores");
	if (exists) await knex.schema.dropTable("NursingHomeSurveyScores");
	const result = await CreateNursingHomeSurveyScoresTable();
	return result;
}

export async function DropAndRecreateNursingHomeSurveyTotalScoresTable(): Promise<void> {
	const exists = await knex.schema.hasTable("NursingHomeSurveyTotalScores");
	if (exists) await knex.schema.dropTable("NursingHomeSurveyTotalScores");
	const result = await CreateNursingHomeSurveyTotalScoresTable();
	return result;
}

export async function DropAndRecreateNursingHomeSurveyQuestionsTable(): Promise<void> {
	const exists = await knex.schema.hasTable("NursingHomeSurveyQuestions");
	if (exists) await knex.schema.dropTable("NursingHomeSurveyQuestions");
	const result = await CreateNursingHomeSurveyQuestionsTable();
	return result;
}

export async function InsertNursingHomeToDB(
	nursingHome: NursingHome,
): Promise<string> {
	// Prolly should not do in models but WIP / MVP
	const geo_query = [
		nursingHome.address,
		nursingHome.city,
		nursingHome.postal_code,
		"Finland",
	];
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

export async function AddNursingHomeSurveyQuestion(
	surveyId: string,
	order: number,
	questionType: string,
	question: string,
	questionDescription: string,
	active: boolean
): Promise<void> {
	await knex("NursingHomeSurveyQuestions").insert({
		survey_id: surveyId,
		order: order,
		question_type: questionType,
		question: question,
		question_description: questionDescription,
		active: active
	});
}

export async function AddNursingHomeSurveyKeys(
	amount: number,
): Promise<any[]> {
	let keys: any[] = [];
	for(let i = 0; i < amount; i++){
		const key = createSurveyKey(8);
		keys.push({key: key})
	}
	await knex("NursingHomeSurveyKeys").insert(keys);

	return keys;
}

export async function GetSurvey(surveyId: string): Promise<any[]> {
	const result = await knex.table("NursingHomeSurveyQuestions")
		.select()
		.where({ survey_id: surveyId });
	return result;
}

export async function GetNursingHomeSurveyResults(nursingHomeId:string ): Promise<any[]> {
	const results = await knex.table("NursingHomeSurveyScores")
		.select()
		.where({ nursinghome_id: nursingHomeId });

	
	return results;
}

export async function SubmitSurveyResponse(
	survey: any,
	nursinghomeId: string,
	key: string
): Promise<void> {

	let total_score = 0;
	let num_questions = 0;

	console.log(JSON.stringify(survey));

	const validKey = await GetValidSurveyKey(key);

	if (validKey) {

		for (const question of survey) {
			const currentScores = await knex
				.table("NursingHomeSurveyScores")
				.select()
				.where({
					question_id: question.id, 
					nursinghome_id: nursinghomeId
				});

			if(currentScores.length === 0 && validNumericSurveyScore(question.value)){
				await knex
				.table("NursingHomeSurveyScores")
				.insert({
					question_id: question.id, 
					nursinghome_id: nursinghomeId,
					answers: 1,
					average: question.value
				});

				total_score += question.value;
				num_questions += 1;
				
			}else{

				if (validNumericSurveyScore(question.value)){

					const newSum = currentScores[0].answers + 1;
					const newAvg = (currentScores[0].average * currentScores[0].answers + question.value) / newSum;

					await knex
					.table("NursingHomeSurveyScores")
					.where({
						question_id: question.id, 
						nursinghome_id: nursinghomeId
					})
					.update({
						answers: newSum,
						average: newAvg
					});

					total_score += newAvg;
					num_questions += 1;

				}else if (currentScores.length > 0){
					total_score += currentScores[0].average;
					num_questions += 1;
				}
			}

		}

		const currentTotal = await knex
			.table("NursingHomeSurveyTotalScores")
			.select()
			.where({
				nursinghome_id: nursinghomeId
			});

		if(num_questions > 0){
			if(currentTotal.length === 0){
				await knex
					.table("NursingHomeSurveyTotalScores")
					.insert({
						nursinghome_id: nursinghomeId,
						average: (total_score / num_questions),
						answers: 1
					});
			}else{
				await knex
					.table("NursingHomeSurveyTotalScores")
					.where({
						nursinghome_id: nursinghomeId
					})
					.update({
						average: (total_score / num_questions),
						answers: currentTotal[0].answers + 1
					});
			}
		}
	}

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
	const result = await knex.table("NursingHomes").where({ id: id });

	return result;
}

export async function DeleteAllNursingHomes(): Promise<number> {
	const result = await knex.table("NursingHomes").del();
	return result;
}

export async function DeleteNursingHome(id: string): Promise<number> {
	const result = await knex
		.table("NursingHomes")
		.where({ id: id })
		.del();
	return result;
}

export async function DeleteNursingHomePics(id: string): Promise<number> {
	const result = await knex
		.table("NursingHomePictures")
		.where({ nursinghome_id: id })
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

// Returns more than 0 results if drive ID found
export async function GetPicsByDriveID(drive_id: string): Promise<any[]> {
	const columns = nursing_home_pictures_columns_info
		.filter((row_info: any) => {
			if (!row_info.sql.includes("caption")) return true;
			return false;
		})
		.map((row_info: any) => {
			if (!row_info.sql.includes("caption")) return row_info.sql;
		});
	const query: any = knex.select().table("NursingHomePictures");
	columns.map((column: any) => {
		query.orWhere({ [column + "_drive_id"]: drive_id });
	});
	return query;
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

export async function GetPdfData(
	nursinghome_id: string,
): Promise<any[]> {
	return await knex
		.select("report_file")
		.table("NursingHomeReports")
		.where({ nursinghome_id: nursinghome_id });
}

export async function GetNursingHomeStatus(
	nursinghome_id: string,
): Promise<any[]> {
	return await knex
		.select("status", "date")
		.table("NursingHomeReports")
		.where({ nursinghome_id: nursinghome_id });
}

export async function GetNursingHomeRating(
	nursinghome_id: string,
): Promise<any[]> {
	return await knex
		.select("average", "answers")
		.table("NursingHomeSurveyTotalScores")
		.where({ nursinghome_id: nursinghome_id });
}

export async function GetAllNursingHomeStatus(): Promise<any[]> {
	return await knex
		.select("status", "date", "nursinghome_id")
		.table("NursingHomeReports");
}

export async function GetAllNursingHomeRatings(): Promise<any[]> {
	return await knex
		.select()
		.table("NursingHomeSurveyTotalScores");
}


export async function GetDistinctCities(): Promise<any[]> {
	return await knex("NursingHomes").distinct("city");
}

export async function UploadNursingHomeReport(  //USE ONLY WHEN AUTHENTICATED
	id: string,
	status: string,
	date: string,
	file: any,
): Promise<boolean> {

	const nursingHomeValid = await knex
			.select()
			.table("NursingHomes")
			.where({ id });

	if(nursingHomeValid.length === 0) return false;

	const nursingHomeExsists = await knex
			.select()
			.table("NursingHomeReports")
			.where({ nursinghome_id: id });

	if(nursingHomeExsists.length < 1) {
		await knex("NursingHomeReports").insert({nursinghome_id: id});
	}

	let fileData = file != "" ? Buffer.from(file.split(",")[1], 'base64') : null;

	let count = await knex("NursingHomeReports")
		.where({ nursinghome_id: id})
		.update({
			status: status,
			date: date,
			report_file: fileData
		});

	if (count == 0) return false;

	return true;
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

export async function UpdateNursingHomeImage(
	id: string,
	basicUdpateKey: string,
	image: any,
): Promise<boolean> {

	if (image) { 
		const nursingHomeExsists = await knex
			.select()
			.table("NursingHomePictures")
			.where({ nursinghome_id: id });

		if(nursingHomeExsists.length < 1) {
			await knex("NursingHomePictures").insert({nursinghome_id: id});
		}

		if (image.value || image.remove) { 
	
			let imageData = image.remove ? new Buffer("", 'base64') : new Buffer(image.value.split(",")[1], 'base64');
	
			if (!image.remove) imageData = await resizeImage(imageData);
		
			await knex("NursingHomePictures")
				.where({ nursinghome_id: id })
				.update({
					[image.name]: image.remove ? null : imageData,
					[image.name + "_hash"]: image.remove ? null : checksum(imageData)
			});
		}
		
		if(image.name != "owner_logo") {
			//only update the text if no image was given
			await knex("NursingHomePictures")
			.where({ nursinghome_id: id })
			.update({
				[image.name + "_caption"]: image.text
			});
		}

	}

	return true;
}


export async function UpdateNursingHomeInformation(
	id: string,
	basicUdpateKey: string,
	status: boolean,
): Promise<boolean> {
	const now = new Date().toISOString();

	let count = await knex("NursingHomes")
		.where({ id, basic_update_key: basicUdpateKey })
		.update({
			has_vacancy: status,
			vacancy_last_updated_at: now,
		});
	
	if (count !== 1) return false;

	return true;
}

export interface BasicUpdateKeyEntry {
	id: string;
	basic_update_key: string;
	name: string;
}

export async function GetAllBasicUpdateKeys(): Promise<BasicUpdateKeyEntry[]> {
	const res = await knex("NursingHomes").select(
		"id",
		"basic_update_key",
		"name",
	);
	return res.map(({ id, basic_update_key, name }) => ({
		id,
		basic_update_key,
		name,
	}));
}

export async function GetLoginCookieHash(): Promise<string> {
	const hash = hashWithSalt(uuidv4(), process.env.VALVONTA_PASSWORD as string);
	const timestamp = Date.now();
	await knex("AdminSessions").insert({hash: hash, date: timestamp});
	return hash;
}

export async function GetHasLogin(cookie: string): Promise<boolean> {
	const sessions = await knex("AdminSessions").select("date").where({hash: cookie});
	if(sessions.length == 1){
		return true;
	}else{
		return false;
	}
}

export async function GetValidSurveyKey(key: string): Promise<boolean> {
	const keys = await knex("NursingHomeSurveyKeys").select().where({key: key});
	if(keys.length == 1){
		return true;
	}else{
		return false;
	}
}










//DUMMY DATA FOR TESTING


export async function addDummyNursingHome(): Promise<string> {
	const nursinghome: NursingHome = {
		name: "Testi 1",
		owner: "Omistaja 1",
		postal_code: "00010",
		city: "Espoo",
		address: "Tie 1",
		language: "Suomi",
		tour_info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus egestas efficitur. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem."
	};

	await InsertNursingHomeToDB(nursinghome)

	const nursinghome2: NursingHome = {
		name: "Testi 2 Nursinghome with a very long name",
		owner: "Omistaja 2",
		postal_code: "00015",
		city: "Espoo",
		address: "Suotie 1",
		language: "Ruotsi",
		tour_info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus egestas efficitur. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem."

	};
	await InsertNursingHomeToDB(nursinghome2)

	const nursinghome3: NursingHome = {
		name: "Testi 3",
		owner: "Omistaja 3",
		postal_code: "00020",
		city: "Kerava",
		address: "Ojatie 1",
		language: "Suomi",
		tour_info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus egestas efficitur. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem."
	};

	await InsertNursingHomeToDB(nursinghome3)

	const nursinghome4: NursingHome = {
		name: "Testi 4",
		owner: "Omistaja 4",
		postal_code: "00025",
		city: "Helsinki",
		address: "Jokitie 1",
		language: "Suomi",
		tour_info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus egestas efficitur. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem."
	};

	await InsertNursingHomeToDB(nursinghome4)

	const nursinghome5: NursingHome = {
		name: "Testi 5",
		owner: "Omistaja 5",
		postal_code: "00030",
		city: "Vantaa",
		address: "Tie 1",
		language: "Suomi",
		tour_info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus egestas efficitur. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem."

	};

	return await InsertNursingHomeToDB(nursinghome5);
}
