import {
	InsertNursingHomeToDB,
	GetAllNursingHomes,
	GetAllRatings} from "./models"

const parse = require("csv-parse/lib/sync")

async function NursingHomesFromCSV(csv: string)
{
	const records: object[] = parse(csv, {
		columns: true,
		skip_empty_lines: true,
		skip_lines_with_empty_values: true,
		delimiter: ";"
	})

	records.map(async (record: any) =>
	{
		console.log(record.Asunnot);
		await InsertNursingHomeToDB({name: record.Hoivakoti,
			owner: record.Yritys,
			address: record.Katuosoite,
			location: record.Alue,
			www: record.www,
			ara: record.ARA ? record.ARA : false,
			apartment_count: record.Asunnot,
			language: record.Kieli,
			lah: record.LAH ? record.LAH : false,
		})
	})

	return (records)
}

export {NursingHomesFromCSV}