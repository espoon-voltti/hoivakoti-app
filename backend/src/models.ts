import queryString from "querystring";
import axios from "axios";
import { FeedbackState } from "./nursinghome-typings";
/* eslint-disable @typescript-eslint/no-use-before-define */
import Knex, { CreateTableBuilder } from "knex";
import uuidv4 from "uuid/v4";
import rp from "request-promise-native";
import crypto, { BinaryLike } from "crypto";
import {
	Commune,
	NursingHome,
	nursing_home_pictures_columns_info,
	postal_code_to_district,
} from "./nursinghome-typings";
import config from "./config";
import {
	createBasicUpdateKey,
	hashWithSalt,
	NursingHomesFromCSV,
	validNumericSurveyScore,
	createSurveyKey,
	getDateDaysAgo,
} from "./services";
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

knex.schema
	.hasTable("NursingHomeCustomerCommunes")
	.then(async (exists: boolean) => {
		if (exists) return;

		await CreateNursingHomeCustomerCommunesTable();
	});

knex.schema.hasTable("NursingHomeReports").then(async (exists: boolean) => {
	if (exists) return;

	await CreateNursingHomeReportsTable();
});

knex.schema
	.hasTable("NursingHomeSurveyQuestions")
	.then(async (exists: boolean) => {
		if (exists) return;

		await CreateNursingHomeSurveyQuestionsTable();
	});

knex.schema
	.hasTable("NursingHomeSurveyAnswers")
	.then(async (exists: boolean) => {
		if (exists) {
			knex.schema
				.hasColumn("NursingHomeSurveyAnswers", "created_date")
				.then(async (exists: boolean) => {
					if (exists) return;
					await knex.schema.table(
						"NursingHomeSurveyAnswers",
						table => {
							table
								.dateTime("created_date")
								.defaultTo(new Date().toISOString());
						},
					);
				});
			return;
		}

		await CreateNursingHomeSurveyAnswersTable();
	});

knex.schema
	.hasTable("NursingHomeSurveyTextAnswers")
	.then(async (exists: boolean) => {
		if (exists) return;

		await CreateNursingHomeSurveyTextAnswersTable();
	});

knex.schema
	.hasTable("NursingHomeSurveyScores")
	.then(async (exists: boolean) => {
		if (exists) return;

		await CreateNursingHomeSurveyScoresTable();
	});

knex.schema
	.hasTable("NursingHomeSurveyTotalScores")
	.then(async (exists: boolean) => {
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

async function resizeImage(image: Buffer) {
	return await sharp(image)
		.resize(900, 900, {
			fit: sharp.fit.inside,
			withoutEnlargement: true,
		})
		.jpeg({ quality: 90 })
		.toBuffer();
}

async function CreateNursingHomePicturesTable(): Promise<void> {
	await knex.schema.createTable("NursingHomePictures", (table: any) => {
		nursing_home_pictures_columns_info.map((row_info: any) => {
			if (row_info.sql.includes("caption")) {
				table.string(row_info.sql);
			} else {
				table.binary(row_info.sql);
				table.string(row_info.sql + "_hash");
				table.string(row_info.sql + "_drive_id");
			}
		});
		table.string("nursinghome_id");
	});
}

async function CreateNursingHomeCustomerCommunesTable(): Promise<void> {
	await knex.schema.createTable(
		"NursingHomeCustomerCommunes",
		(table: CreateTableBuilder) => {
			table.string("nursinghome_id");
			table.json("customer_commune");
		},
	);
}

async function CreateNursingHomeReportsTable(): Promise<void> {
	await knex.schema.createTable("NursingHomeReports", (table: any) => {
		table.string("nursinghome_id");
		table.string("date");
		table.string("status");
		table.string("type");
		table.binary("report_file");
	});

	const nursingHomes = await GetAllNursingHomes();
	for (const nursingHome of nursingHomes) {
		if (nursingHome.city != "Espoo" && nursingHome.city != "Esbo") {
			await knex.table("NursingHomeReports").insert({
				nursinghome_id: nursingHome.id,
				status: "no-info",
			});
		}
	}
}

async function CreateAdminSessionsTable(): Promise<void> {
	await knex.schema.createTable("AdminSessions", (table: any) => {
		table.string("hash");
		table.string("date");
	});
}

async function CreateNursingHomeSurveyQuestionsTable(): Promise<void> {
	await knex.schema.createTable(
		"NursingHomeSurveyQuestions",
		(table: any) => {
			table.increments("id");
			table.string("survey_id");
			table.integer("order");
			table.boolean("active");
			table.string("question_type");
			table.string("question_fi");
			table.string("question_sv");
			table.string("question_description_fi");
			table.string("question_description_sv");
			table.string("question_icon");
		},
	);
}

async function CreateNursingHomeSurveyAnswersTable(): Promise<void> {
	await knex.schema.createTable("NursingHomeSurveyAnswers", (table: any) => {
		table.increments("id");
		table.integer("question_id");
		table.string("nursinghome_id");
		table.string("answer");
		table.string("key");
		table.boolean("replaced");
		table.dateTime("created_date").defaultTo(new Date().toISOString());
	});
}

async function CreateNursingHomeSurveyTextAnswersTable(): Promise<void> {
	await knex.schema.createTable(
		"NursingHomeSurveyTextAnswers",
		(table: any) => {
			table.string("id", 16);
			table.string("answer_text", 600);
			table.string("response_text", 600);
			table.dateTime("response_date");
			table.enu("feedback_state", [...Object.values(FeedbackState)]);
		},
	);
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
	await knex.schema.createTable(
		"NursingHomeSurveyTotalScores",
		(table: any) => {
			table.string("nursinghome_id");
			table.float("average_relatives");
			table.integer("answers_relatives");
			table.float("average_customers");
			table.integer("answers_customers");
		},
	);
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

export async function DropAndRecreateNursingHomeSurveyAnswersTable(): Promise<
	void
> {
	let exists = await knex.schema.hasTable("NursingHomeSurveyAnswers");
	if (exists) await knex.schema.dropTable("NursingHomeSurveyAnswers");

	exists = await knex.schema.hasTable("NursingHomeSurveyTextAnswers");
	if (exists) await knex.schema.dropTable("NursingHomeSurveyTextAnswers");

	await CreateNursingHomeSurveyAnswersTable();
	await CreateNursingHomeSurveyTextAnswersTable();
}

export async function DropAndRecreateNursingHomeSurveyScoresTable(): Promise<
	void
> {
	const exists = await knex.schema.hasTable("NursingHomeSurveyScores");
	if (exists) await knex.schema.dropTable("NursingHomeSurveyScores");
	const result = await CreateNursingHomeSurveyScoresTable();
	return result;
}

export async function DropAndRecreateNursingHomeSurveyTotalScoresTable(): Promise<
	void
> {
	const exists = await knex.schema.hasTable("NursingHomeSurveyTotalScores");
	if (exists) await knex.schema.dropTable("NursingHomeSurveyTotalScores");
	await CreateNursingHomeSurveyTotalScoresTable();
	const surveys = [
		{ name: "asiakaskysely", db: "_customers" },
		{ name: "omaiskysely", db: "_relatives" },
	];

	const nursingHomes = await knex.table("NursingHomes").select("id");

	for (const nursingHome of nursingHomes) {
		await knex.table("NursingHomeSurveyTotalScores").insert({
			nursinghome_id: nursingHome.id,
		});
	}

	for (const survey of surveys) {
		const nursingHomeScores = await knex
			.table("NursingHomeSurveyScores")
			.join(
				"NursingHomeSurveyQuestions",
				"NursingHomeSurveyQuestions.id",
				"NursingHomeSurveyScores.question_id",
			)
			.select("nursinghome_id", "answers")
			.avg("average")
			.where({ survey_id: survey.name })
			.groupBy("nursinghome_id", "answers");

		for (const score of nursingHomeScores) {
			await knex
				.table("NursingHomeSurveyTotalScores")
				.update({
					["average" + survey.db]: score.avg,
					["answers" + survey.db]: score.answers,
				})
				.where({
					nursinghome_id: score.nursinghome_id,
				});
		}
	}
}

export async function DropAndRecreateNursingHomeSurveyQuestionsTable(): Promise<
	void
> {
	const exists = await knex.schema.hasTable("NursingHomeSurveyQuestions");
	if (exists) await knex.schema.dropTable("NursingHomeSurveyQuestions");
	const result = await CreateNursingHomeSurveyQuestionsTable();
	return result;
}

export async function DropAndRecreateReportsTable(): Promise<void> {
	const exists = await knex.schema.hasTable("NursingHomeReports");
	if (exists) await knex.schema.dropTable("NursingHomeReports");
	const result = await CreateNursingHomeReportsTable();
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
		if (nursingHome.city != "Espoo" && nursingHome.city != "Esbo") {
			await knex.table("NursingHomeReports").insert({
				nursinghome_id: uuid,
				status: "no-info",
			});
		}

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
		if (nursingHome.city != "Espoo" && nursingHome.city != "Esbo") {
			await knex.table("NursingHomeReports").insert({
				nursinghome_id: uuid,
				status: "no-info",
			});
		}

		return uuid;
	}
}

export async function AddNursingHomeSurveyQuestion(
	surveyId: string,
	order: number,
	questionType: string,
	questionFI: string,
	questionSV: string,
	questionDescriptionFI: string,
	questionDescriptionSV: string,
	questionIcon: string,
	active: boolean,
): Promise<void> {
	await knex("NursingHomeSurveyQuestions").insert({
		survey_id: surveyId,
		order: order,
		question_type: questionType,
		question_fi: questionFI,
		question_sv: questionSV,
		question_description_fi: questionDescriptionFI,
		question_description_sv: questionDescriptionSV,
		question_icon: questionIcon,
		active: active,
	});
}

export async function UpdateNursingHomeSurveyQuestion(
	id: number,
	surveyId: string,
	order: number,
	questionType: string,
	questionFI: string,
	questionSV: string,
	questionDescriptionFI: string,
	questionDescriptionSV: string,
	questionIcon: string,
	active: boolean,
): Promise<void> {
	await knex("NursingHomeSurveyQuestions")
		.where({ id: id })
		.update({
			survey_id: surveyId,
			order: order,
			question_type: questionType,
			question_fi: questionFI,
			question_sv: questionSV,
			question_description_fi: questionDescriptionFI,
			question_description_sv: questionDescriptionSV,
			question_icon: questionIcon,
			active: active,
		});
}

export async function RemoveNursingHomeSurveyQuestion(
	id: number,
	surveyId: string,
): Promise<any> {
	const result = await knex("NursingHomeSurveyQuestions")
		.where({ id: id, survey_id: surveyId })
		.del();

	return result;
}

export async function AddNursingHomeSurveyKeys(amount: number): Promise<any[]> {
	let keys: any[] = [];
	for (let i = 0; i < amount; i++) {
		const key = createSurveyKey(8);
		keys.push({ key: key });
	}
	await knex("NursingHomeSurveyKeys").insert(keys);

	return keys;
}

export async function GetSurvey(surveyId: string): Promise<any[]> {
	const result = await knex
		.table("NursingHomeSurveyQuestions")
		.select()
		.where({ survey_id: surveyId })
		.orderBy("order");
	return result;
}

export async function GetNursingHomeSurveyResults(
	nursingHomeId: string,
): Promise<any[]> {
	const results = await knex
		.table("NursingHomeSurveyScores")
		.select()
		.where({ nursinghome_id: nursingHomeId });

	return results;
}

export async function GetSurveyTextResults(
	nursingHomeId: string,
): Promise<any[]> {
	const results = await knex
		.table("NursingHomeSurveyTextAnswers")
		.join(
			"NursingHomeSurveyAnswers",
			"NursingHomeSurveyAnswers.answer",
			"NursingHomeSurveyTextAnswers.id",
		)
		.select(
			"NursingHomeSurveyTextAnswers.id",
			"answer_text",
			"created_date",
			"feedback_state",
			"response_text",
			"response_date",
		)
		.where({ nursinghome_id: nursingHomeId })
		.where("created_date", ">", getDateDaysAgo(config.feedbackExpires));

	return results;
}

export async function GetSurveyApprovedResults(
	nursingHomeId: string,
): Promise<any[]> {
	const results = await knex
		.table("NursingHomeSurveyTextAnswers")
		.join(
			"NursingHomeSurveyAnswers",
			"NursingHomeSurveyAnswers.answer",
			"NursingHomeSurveyTextAnswers.id",
		)
		.select(
			"NursingHomeSurveyTextAnswers.id",
			"answer_text",
			"created_date",
			"feedback_state",
			"response_text",
			"response_date",
		)
		.where({ nursinghome_id: nursingHomeId })
		.where("created_date", ">", getDateDaysAgo(config.feedbackExpires))
		.where("feedback_state", FeedbackState.APPROVED);

	return results;
}

export async function GetAllSurveyTextResults(): Promise<any> {
	const results = await knex
		.table("NursingHomeSurveyTextAnswers")
		.join(
			"NursingHomeSurveyAnswers",
			"NursingHomeSurveyAnswers.answer",
			"NursingHomeSurveyTextAnswers.id",
		)
		.select(
			"NursingHomeSurveyAnswers.nursinghome_id",
			"NursingHomeSurveyTextAnswers.id",
			"NursingHomeSurveyTextAnswers.answer_text",
			"NursingHomeSurveyTextAnswers.feedback_state",
		)
		.where("created_date", ">", getDateDaysAgo(config.feedbackExpires));

	return results;
}

export async function UpdateSurveyTextState(
	answerId: string | string[],
	newState: FeedbackState,
): Promise<boolean> {
	let count;

	if (Array.isArray(answerId)) {
		count = await knex("NursingHomeSurveyTextAnswers")
			.whereIn("id", answerId)
			.update({
				feedback_state: newState,
			});
	} else {
		count = await knex("NursingHomeSurveyTextAnswers")
			.where({ id: answerId })
			.update({
				feedback_state: newState,
			});
	}

	if (count < 1) return false;

	return true;
}

export async function DeleteRejectedSurveyTextResults(): Promise<boolean> {
	const results = await GetAllSurveyTextResults();

	const rejectedResults: string[] = results
		.filter(
			(result: any) => result.feedback_state === FeedbackState.REJECTED,
		)
		.map((rejected: any) => rejected.id);

	const textAnswersCount = await knex
		.table("NursingHomeSurveyTextAnswers")
		.whereIn("id", rejectedResults)
		.del();

	if (textAnswersCount < 1) return false;

	const answersCount = await knex
		.table("NursingHomeSurveyAnswers")
		.whereIn("answer", rejectedResults)
		.update({ answer: "" });

	if (answersCount < 1) return false;

	return true;
}

export async function SubmitSurveyData( //USE ONLY WHEN AUTHENTICATED
	nursinghomeId: string,
	surveyData: any,
): Promise<string> {
	let totalScore = 0;
	let numQuestions = 0;

	for (const question of surveyData) {
		const currentScores = await knex
			.table("NursingHomeSurveyScores")
			.select()
			.where({
				question_id: question.id,
				nursinghome_id: nursinghomeId,
			});

		if (
			currentScores.length === 0 &&
			validNumericSurveyScore(question.average)
		) {
			await knex.table("NursingHomeSurveyScores").insert({
				question_id: question.id,
				nursinghome_id: nursinghomeId,
				answers: question.answers,
				average: question.average,
			});

			totalScore += question.average;
			numQuestions += 1;
		} else {
			if (validNumericSurveyScore(question.average)) {
				await knex
					.table("NursingHomeSurveyScores")
					.where({
						question_id: question.id,
						nursinghome_id: nursinghomeId,
					})
					.update({
						answers: question.answers,
						average: question.average,
					});

				totalScore += question.average;
				numQuestions += 1;
			} else if (currentScores.length > 0) {
				totalScore += currentScores[0].average;
				numQuestions += 1;
			}
		}
	}

	const currentTotal = await knex
		.table("NursingHomeSurveyTotalScores")
		.select()
		.where({
			nursinghome_id: nursinghomeId,
		});

	if (numQuestions > 0) {
		if (currentTotal.length === 0) {
			await knex.table("NursingHomeSurveyTotalScores").insert({
				nursinghome_id: nursinghomeId,
				average_customers: totalScore / numQuestions,
				answers_customers: surveyData[0].answers,
			});
		} else {
			await knex
				.table("NursingHomeSurveyTotalScores")
				.where({
					nursinghome_id: nursinghomeId,
				})
				.update({
					average_customers: totalScore / numQuestions,
					answers_customers: surveyData[0].answers,
				});
		}
	}
	return "updated";
}

export async function SubmitSurveyResponse(
	survey: any,
	nursinghomeId: string,
	key: string,
): Promise<void> {
	let totalScore = 0;
	let numQuestions = 0;
	let updateTotal = 1; //use number instead of boolean for multiplication

	const validKey = await GetIsValidSurveyKey(key);

	if (validKey) {
		//remove possible old answers with same key code
		let oldAnswersNursingHomeId = "";

		const existingAnswer = await knex
			.table("NursingHomeSurveyAnswers")
			.select()
			.where({
				key: key,
				nursinghome_id: nursinghomeId,
				replaced: false,
			});

		if (existingAnswer.length != 0) {
			updateTotal = 0; //do not increment total count to NursingHomeSurveyTotalScores

			oldAnswersNursingHomeId = existingAnswer[0].nursinghome_id;

			for (const answer of existingAnswer) {
				if (answer.answer.length == 1) {
					const currentScores = await knex
						.table("NursingHomeSurveyScores")
						.select()
						.where({
							question_id: answer.question_id,
							nursinghome_id: oldAnswersNursingHomeId,
						});

					let newAvg =
						currentScores[0].average * currentScores[0].answers -
						answer.answer; //remove old answer from average
					if (newAvg > 0)
						newAvg = newAvg / (currentScores[0].answers - 1);

					await knex
						.table("NursingHomeSurveyScores")
						.where({
							question_id: answer.question_id,
							nursinghome_id: oldAnswersNursingHomeId,
						})
						.update({
							answers: currentScores[0].answers - 1,
							average: newAvg,
						});
				}
			}
		}

		await knex
			.table("NursingHomeSurveyAnswers")
			.where({
				key: key,
				nursinghome_id: nursinghomeId,
				replaced: false,
			})
			.update({
				replaced: true,
			});

		//store new values
		const today = new Date();

		for (const question of survey) {
			if (question.question_type == "rating") {
				const currentScores = await knex
					.table("NursingHomeSurveyScores")
					.select()
					.where({
						question_id: question.id,
						nursinghome_id: nursinghomeId,
					});

				if (
					currentScores.length === 0 &&
					validNumericSurveyScore(question.value)
				) {
					await knex.table("NursingHomeSurveyScores").insert({
						question_id: question.id,
						nursinghome_id: nursinghomeId,
						answers: 1,
						average: question.value,
					});

					await knex.table("NursingHomeSurveyAnswers").insert({
						question_id: question.id,
						nursinghome_id: nursinghomeId,
						answer: question.value,
						key: key,
						replaced: false,
					});

					totalScore += question.value;
					numQuestions += 1;
				} else {
					if (validNumericSurveyScore(question.value)) {
						const newSum = currentScores[0].answers + 1;
						const newAvg =
							(currentScores[0].average *
								currentScores[0].answers +
								question.value) /
							newSum;

						await knex
							.table("NursingHomeSurveyScores")
							.where({
								question_id: question.id,
								nursinghome_id: nursinghomeId,
							})
							.update({
								answers: newSum,
								average: newAvg,
							});

						await knex.table("NursingHomeSurveyAnswers").insert({
							question_id: question.id,
							nursinghome_id: nursinghomeId,
							answer: question.value,
							key: key,
							replaced: false,
							created_date: today.toISOString(),
						});

						totalScore += newAvg;
						numQuestions += 1;
					} else if (currentScores.length > 0) {
						totalScore += currentScores[0].average;
						numQuestions += 1;
					}
				}
			} else if (
				question.question_type == "text" &&
				question.value != null
			) {
				const sqlJoinKey = createSurveyKey(16);
				await knex.table("NursingHomeSurveyAnswers").insert({
					question_id: question.id,
					nursinghome_id: nursinghomeId,
					answer: sqlJoinKey,
					key: key,
					replaced: false,
					created_date: today.toISOString(),
				});

				await knex.table("NursingHomeSurveyTextAnswers").insert({
					id: sqlJoinKey,
					answer_text: question.value.slice(0, 600),
					feedback_state: FeedbackState.OPEN,
				});
			}
		}

		const currentTotal = await knex
			.table("NursingHomeSurveyTotalScores")
			.select()
			.where({
				nursinghome_id: nursinghomeId,
			});

		const answersTotal = (
			await knex
				.table("NursingHomeSurveyAnswers")
				.join(
					"NursingHomeSurveyQuestions",
					"NursingHomeSurveyQuestions.id",
					"NursingHomeSurveyAnswers.question_id",
				)
				.countDistinct("key")
				.where({
					survey_id: "omaiskysely",
					nursinghome_id: nursinghomeId,
					replaced: false,
				})
		)[0].count;

		if (numQuestions > 0) {
			if (currentTotal.length === 0) {
				await knex.table("NursingHomeSurveyTotalScores").insert({
					nursinghome_id: nursinghomeId,
					average_relatives: totalScore / numQuestions,
					answers_relatives: 1,
				});
			} else {
				await knex
					.table("NursingHomeSurveyTotalScores")
					.where({
						nursinghome_id: nursinghomeId,
					})
					.update({
						average_relatives: totalScore / numQuestions,
						answers_relatives: answersTotal,
					});
			}
		}
	}
}

export async function SubmitFeedbackResponse(
	response: string,
	textAnswerId: string,
): Promise<void> {
	await knex
		.table("NursingHomeSurveyTextAnswers")
		.where({ id: textAnswerId })
		.update({
			response_text: response,
			response_date: new Date().toISOString(),
		});
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

export async function DeleteNursingHomeByUpdateKey(
	id: string,
	updateId: string,
): Promise<boolean> {
	const result = await knex("NursingHomes")
		.where({
			id: id,
			basic_update_key: updateId,
		})
		.del();

	if (result < 1) {
		return false;
	}

	return true;
}

export async function UpdateNursingHomeInformation(
	id: string,
	basicUpdateKey: string,
	body: NursingHome,
): Promise<boolean> {
	let count = await knex("NursingHomes")
		.where({ id, basic_update_key: basicUpdateKey })
		.update({
			...body,
		});

	if (count !== 1) return false;

	return true;
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

export async function GetPdfData(nursinghome_id: string): Promise<any[]> {
	return await knex
		.select("report_file")
		.table("NursingHomeReports")
		.where({ nursinghome_id: nursinghome_id })
		.orderBy("date", "desc");
}

export async function GetNursingHomeStatus(
	nursinghome_id: string,
): Promise<any[]> {
	return await knex
		.select("status", "date", "type")
		.table("NursingHomeReports")
		.where({ nursinghome_id: nursinghome_id })
		.orderBy("date", "desc");
}

export async function GetNursingHomeRating(
	nursinghome_id: string,
): Promise<any[]> {
	return await knex
		.select(
			"average_relatives",
			"answers_relatives",
			"average_customers",
			"answers_customers",
		)
		.table("NursingHomeSurveyTotalScores")
		.where({ nursinghome_id: nursinghome_id });
}

export async function GetAllNursingHomeStatus(): Promise<any[]> {
	return await knex
		.select("nursinghome_id", "status", "date")
		.table("NursingHomeReports")
		.orderBy("date", "asc");
	// here we sort with order asc so (older first) we get the latest status when mapping thru the list and avoid need to filter by date later
}

export async function GetAllNursingHomeRatings(): Promise<any[]> {
	return await knex.select().table("NursingHomeSurveyTotalScores");
}

export async function GetDistinctCities(): Promise<any[]> {
	return await knex("NursingHomes").distinct("city");
}

export async function UploadNursingHomeReport( //USE ONLY WHEN AUTHENTICATED
	id: string,
	date: string,
	type: string,
	status: string,
	file: any,
): Promise<boolean> {
	const nursingHomeValid = await knex
		.select()
		.table("NursingHomes")
		.where({ id });

	if (nursingHomeValid.length === 0) return false;

	const existingReports = await knex
		.select()
		.table("NursingHomeReports")
		.where({ nursinghome_id: id })
		.orderBy("date", "desc");

	const fileData =
		file != "" ? Buffer.from(file.split(",")[1], "base64") : null;

	if (status == "waiting" || status == "no-info") {
		await knex("NursingHomeReports")
			.delete()
			.where({ nursinghome_id: id });
	} else if (existingReports.length == 2) {
		if (
			type != "announced" &&
			existingReports[0].type != "announced" &&
			existingReports[1].type == "announced"
		) {
			// only older existing report is from announced visit. We should remove the newer one in this case.
			await knex("NursingHomeReports")
				.delete()
				.where({ nursinghome_id: id, date: existingReports[0].date });
		} else {
			await knex("NursingHomeReports")
				.delete()
				.where({ nursinghome_id: id, date: existingReports[1].date });
		}
	} else if (
		existingReports.length == 1 &&
		existingReports[0].status == "no-info"
	) {
		// remove no information row from database if its been placed for this numsing home
		await knex("NursingHomeReports")
			.delete()
			.where({ nursinghome_id: id });
	}

	await knex("NursingHomeReports").insert({
		nursinghome_id: id,
		date: date,
		type: type,
		status: status,
		report_file: fileData,
	});

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

		if (nursingHomeExsists.length < 1) {
			await knex("NursingHomePictures").insert({ nursinghome_id: id });
		}

		if (image.value || image.remove) {
			let imageData = image.remove
				? new Buffer("", "base64")
				: new Buffer(image.value.split(",")[1], "base64");

			if (!image.remove) imageData = await resizeImage(imageData);

			await knex("NursingHomePictures")
				.where({ nursinghome_id: id })
				.update({
					[image.name]: image.remove ? null : imageData,
					[image.name + "_hash"]: image.remove
						? null
						: checksum(imageData),
				});
		}

		if (image.name != "owner_logo") {
			//only update the text if no image was given
			await knex("NursingHomePictures")
				.where({ nursinghome_id: id })
				.update({
					[image.name + "_caption"]: image.text,
				});
		}
	}

	return true;
}

export async function UpdateNursingHomeVacancyStatus(
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
	const hash = hashWithSalt(
		uuidv4(),
		process.env.VALVONTA_PASSWORD as string,
	);
	const timestamp = Date.now();
	await knex("AdminSessions").insert({ hash: hash, date: timestamp });
	return hash;
}

export async function GetHasLogin(cookie: string): Promise<boolean> {
	const sessions = await knex("AdminSessions")
		.select("date")
		.where({ hash: cookie });
	if (sessions.length == 1) {
		return true;
	} else {
		return false;
	}
}

export async function GetIsValidSurveyKey(key: string): Promise<boolean> {
	const keys = await knex("NursingHomeSurveyKeys")
		.select()
		.where({ key: key });
	if (keys.length == 1) {
		return true;
	} else {
		return false;
	}
}

export async function GetCustomerCommunesForNursingHome(
	id: string,
): Promise<any> {
	const result = await knex("NursingHomeCustomerCommunes")
		.select()
		.where({ nursinghome_id: id });

	return result;
}

export async function UpdateCustomerCommunesForNursingHome(
	id: string,
	communes: Commune[],
): Promise<boolean> {
	let requestValid = true;

	for (const commune of communes) {
		if (!Object.values(Commune).includes(commune)) {
			requestValid = false;
		}
	}

	if (requestValid) {
		const customerCommunes = await GetCustomerCommunesForNursingHome(id);

		if (customerCommunes && customerCommunes.length > 0) {
			await knex("NursingHomeCustomerCommunes")
				.where({ nursinghome_id: id })
				.update({ customer_commune: JSON.stringify(communes) });
		} else {
			await knex("NursingHomeCustomerCommunes").insert({
				nursinghome_id: id,
				customer_commune: JSON.stringify(communes),
			});
		}

		return true;
	}

	return false;
}

interface CustomerCommuneUpdateItem {
	id: string;
	communes: Commune[];
}

export async function BatchUpdateCustomerCommunes(
	batch: CustomerCommuneUpdateItem[],
): Promise<{ success: boolean; items?: string[] }> {
	const updatedNursingHomes = await Promise.all(
		batch.map(async batchItem => {
			const success = await UpdateCustomerCommunesForNursingHome(
				batchItem.id,
				batchItem.communes,
			);

			if (success) {
				return batchItem.id;
			}
		}),
	);

	if (updatedNursingHomes && updatedNursingHomes.length) {
		return { success: true, items: updatedNursingHomes as string[] };
	}

	return { success: false };
}

const GetUserAccessRoles = async (
	clientId: string,
	username: string,
	token: string,
): Promise<any> => {
	const reqData = queryString.stringify({
		client_id: clientId,
		client_secret: process.env.KEYCLOAK_SECRET,
		username,
		token,
	});

	const res = await axios.post(
		`${process.env.SERVICE_PROXY_ENTRYPOINT}/auth/realms/hoivakodit/protocol/openid-connect/token/introspect`,
		reqData,
	);

	if (
		res.data &&
		res.data["realm_access"].roles &&
		res.data["realm_access"].roles.includes(`${clientId}-access`)
	) {
		return res.data["realm_access"].roles;
	}

	return false;
};

export async function GetAccessToken(
	username: string,
	password: string,
	type: string,
): Promise<any> {
	try {
		const reqData = queryString.stringify({
			client_id: type,
			grant_type: "password",
			client_secret: process.env.KEYCLOAK_SECRET,
			username,
			password,
		});

		const res = await axios.post(
			`${process.env.SERVICE_PROXY_ENTRYPOINT}/auth/realms/hoivakodit/protocol/openid-connect/token`,
			reqData,
		);

		const userAccessRoles = await GetUserAccessRoles(
			type,
			username,
			res.data["access_token"],
		);

		const userIsAllowed = userAccessRoles.length;

		if (userIsAllowed) {
			const hash = hashWithSalt(uuidv4(), res.data["refresh_token"]);
			const timestamp = Date.now();

			await knex("AdminSessions").insert({ hash: hash, date: timestamp });

			return {
				access_token: res.data["access_token"],
				refresh_token: res.data["refresh_token"],
				hash,
				roles: userAccessRoles,
			};
		}

		return { statusMessage: "Could not retrieve access token." };
	} catch (error) {
		return error;
	}
}

export async function RefreshToken(
	token: string,
	username: string,
	hash: string,
	type: string,
): Promise<any> {
	try {
		const sessions = await knex("AdminSessions")
			.select("date")
			.where({ hash });

		if (sessions.length !== 1) {
			return { statusMessage: "Session invalid." };
		}

		const reqData = queryString.stringify({
			client_id: type,
			grant_type: "refresh_token",
			client_secret: process.env.KEYCLOAK_SECRET,
			refresh_token: token,
		});

		const res = await axios.post(
			`${process.env.SERVICE_PROXY_ENTRYPOINT}/auth/realms/hoivakodit/protocol/openid-connect/token`,
			reqData,
		);

		const userAccessRoles = await GetUserAccessRoles(
			type,
			username,
			res.data["access_token"],
		);

		const userIsAllowed = userAccessRoles.length;

		if (userIsAllowed) {
			return {
				access_token: res.data["access_token"],
				refresh_token: res.data["refresh_token"],
				hash,
				roles: userAccessRoles,
			};
		}

		return { statusMessage: "Could not refresh token." };
	} catch (error) {
		return error;
	}
}

export async function LogoutAccessToken(
	token: string,
	hash: string,
	type: string,
): Promise<any> {
	try {
		const removeSession = await knex("AdminSessions")
			.where({ hash })
			.del();

		if (removeSession !== 1) {
			return { statusMessage: "Could not find session." };
		}

		const reqData = queryString.stringify({
			client_id: type,
			client_secret: process.env.KEYCLOAK_SECRET,
			refresh_token: token,
		});

		const res = await axios.post(
			`${process.env.SERVICE_PROXY_ENTRYPOINT}/auth/realms/hoivakodit/protocol/openid-connect/logout`,
			reqData,
		);

		if (res && res.status) {
			if (res.status === 200 || res.status === 204) {
				return { success: true };
			}
		}

		return { statusMessage: "Could not logout token." };
	} catch (error) {
		return error;
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
		tour_info:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus egestas efficitur. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem.",
	};

	const testNursingHomeId = await InsertNursingHomeToDB(nursinghome);

	await UpdateCustomerCommunesForNursingHome(testNursingHomeId, [
		Commune.EPO,
	]);

	const duplicateNursingHome: NursingHome = {
		name: "Testi 1",
		owner: "Omistaja 1",
		postal_code: "00010",
		city: "Espoo",
		address: "Tie 1",
		language: "Suomi",
		tour_info:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus egestas efficitur. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem.",
	};

	const testDuplicateNursingHomeId = await InsertNursingHomeToDB(
		duplicateNursingHome,
	);

	await UpdateCustomerCommunesForNursingHome(testDuplicateNursingHomeId, [
		Commune.EPO,
	]);

	const nursinghome2: NursingHome = {
		name: "Testi 2 Nursinghome with a very long name",
		owner: "Omistaja 2",
		postal_code: "00015",
		city: "Espoo",
		address: "Suotie 1",
		language: "Ruotsi",
		tour_info:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus egestas efficitur. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem.",
	};
	await InsertNursingHomeToDB(nursinghome2);

	const nursinghome3: NursingHome = {
		name: "Testi 3",
		owner: "Omistaja 3",
		postal_code: "00020",
		city: "Kerava",
		address: "Ojatie 1",
		language: "Suomi",
		tour_info:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus egestas efficitur. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem.",
	};

	await InsertNursingHomeToDB(nursinghome3);

	const nursinghome4: NursingHome = {
		name: "Testi 4",
		owner: "Omistaja 4",
		postal_code: "00025",
		city: "Helsinki",
		address: "Jokitie 1",
		language: "Suomi",
		tour_info:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus egestas efficitur. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem.",
	};

	await InsertNursingHomeToDB(nursinghome4);

	const nursinghome5: NursingHome = {
		name: "Testi 5",
		owner: "Omistaja 5",
		postal_code: "00030",
		city: "Vantaa",
		address: "Tie 1",
		language: "Suomi",
		tour_info:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus egestas efficitur. Nunc iaculis, lorem id iaculis suscipit, nisl mauris elementum sem.",
	};

	return await InsertNursingHomeToDB(nursinghome5);
}
