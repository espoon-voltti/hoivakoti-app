import {
	InsertNursingHomeToDB,
	GetAllNursingHomes,
	GetAllRatings} from "./models"
import {NursingHome, nursing_home_columns_info} from "./nursinghome-typings"

const parse = require("csv-parse/lib/sync")

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

export {NursingHomesFromCSV}