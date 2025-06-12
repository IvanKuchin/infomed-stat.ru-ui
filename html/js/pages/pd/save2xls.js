export default class SaveToXLS {

	_GetTableHeader(record) {
		let tr = document.createElement("tr")

		for (const property in record) {
			let translation = common_infomed_stat.GetMedicalItemNameSpelling(property);
			let th = document.createElement("th");
			th.append(translation);
			tr.appendChild(th);
		}

		return tr;
	}

	_CraftTableFromRecords(records) {
		let table = document.createElement("table");
		table.appendChild(this._GetTableHeader(records[0]));

		records.forEach(record => {
			let tr = document.createElement("tr");
			table.appendChild(tr);

			for (const property in record) {
				let td = document.createElement("td");
				td.append(record[property]);
				tr.appendChild(td);
			}
		})

		return table;
	}

	_RemoveSpecialSymbols(str) {
		let str2 = str.replace(/ /g, '%20');

		return str2;
	}

	_CraftHREF(str) {
		let a = document.createElement("a");
		a.href = 'data:application/vnd.ms-excel, ' + str;
		a.download = "patient_records.xls";

		return a;
	}

	Do(records) {
		let error = "";

		if (records != null) {
			let table = this._CraftTableFromRecords(records);
			let table_string = this._RemoveSpecialSymbols(table.outerHTML);
			let href = this._CraftHREF(table_string);
			href.click();
		}
		else {
			error = new Error("records is null");
		}

		return { error: error };
	}
}