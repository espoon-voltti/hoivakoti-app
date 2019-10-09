import {
	InsertNurseryHomeToDB,
	GetAllNurseryHomes,
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
		await InsertNurseryHomeToDB({name: record.Hoivakoti,
			owner: record.Yritys,
			address: record.Katuosoite,
			location: record.Alue,
			www: record.www,
			ara: record.ARA ? record.ARA : false
		})
	})

	return (records)
}

export {NursingHomesFromCSV}