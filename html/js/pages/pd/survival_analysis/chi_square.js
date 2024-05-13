import ChiTable from './chi_table.js';

export default class ChiSquare {
    constructor() {
        this.validity_threshold = 10;
    }

    _InputDataFromDatasets(datasets, months) {
        const group_count = datasets.length;
        let matrix = new Array(group_count).fill(0).map(() => new Array(months.length + 1).fill(NaN));

        for (let i = 0; i < group_count; i++) {
            const total_patients = datasets[i].data.reduce((acc, curr) => acc + curr.Events + curr.Alive + curr.Censored, 0);
            for (let j = 0; j < months.length; j++) {

                const events_before_month = datasets[i].data.reduce((acc, curr) => {
                    return curr.Time < months[j] ? acc + curr.Events : acc;
                }, 0)

                matrix[i][j] = {
                    observation: total_patients - events_before_month,
                }
            }

			const items_before_last_month = datasets[i].data.filter((item) => item.Time < months[months.length - 1]);
			// patients who died before last month
            matrix[i][months.length] = {
                observation: items_before_last_month.reduce((acc, curr) => acc + curr.Events, 0),
            }
        }

        return matrix;
    }

    _CalcExpectations(matrix) {
        const rows = matrix.length;
        const columns = matrix[0].length;

        let total_per_row = new Array(rows).fill(0);
        let total_per_column = new Array(columns).fill(0);

        for (let i = 0; i < total_per_row.length; i++) {
                total_per_row[i] = matrix[i].reduce((acc, curr) => acc + curr.observation, 0);
        }

        for (let j = 0; j < total_per_column.length; j++) {
            total_per_column[j] = matrix.reduce((acc, curr) => acc + curr[j].observation, 0);
        }
        
        const total = total_per_row.reduce((acc, curr) => acc + curr, 0);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                matrix[i][j].expectation = (total_per_row[i] * total_per_column[j]) / total;
            }
        }

        return matrix;
    }

    Calculate(datasets, months) {
        let matrix = this._InputDataFromDatasets(datasets, months);
        matrix = this._CalcExpectations(matrix);

        return matrix;
    }


    _GetEquation(matrix) {
        let chi_square = 0;

        let math_tag = document.createElementNS("http://www.w3.org/1998/Math/MathML", "math");
        math_tag.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML");

        // craft left side of the equation
        let left_side_sup = document.createElementNS("http://www.w3.org/1998/Math/MathML", "msup");
        let left_side_chi = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
        left_side_chi.innerHTML = "χ";
        let left_side_square = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
        left_side_square.innerHTML = "2";
        left_side_sup.appendChild(left_side_chi);
        left_side_sup.appendChild(left_side_square);
        
        let equal_sign = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
        equal_sign.innerHTML = "=";

        math_tag.appendChild(left_side_sup);
        math_tag.appendChild(equal_sign);

        // craft right side of the equation
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                const curr = Math.pow(matrix[i][j].observation - matrix[i][j].expectation, 2) / matrix[i][j].expectation;
                chi_square += curr;

                if (i > 0 || j > 0) {
                    let plus_sign = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
                    plus_sign.innerHTML = "+";
                    math_tag.appendChild(plus_sign);
                }


                let ratio_nominator = document.createElementNS("http://www.w3.org/1998/Math/MathML", "msup");
                let ratio_nominator_diff = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
                let ratio_nominator_diff_parentesis_open = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
                ratio_nominator_diff_parentesis_open.innerHTML = "(";
                let ratio_nominator_diff_minuend = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mn");
                ratio_nominator_diff_minuend.innerHTML = `${common_infomed_stat.RoundToTwo(matrix[i][j].observation)}`;
                let ratio_nominator_diff_minus = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
                ratio_nominator_diff_minus.innerHTML = `-`;
                let ratio_nominator_diff_subtrahend = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mn");
                ratio_nominator_diff_subtrahend.innerHTML = `${common_infomed_stat.RoundToTwo(matrix[i][j].expectation)}`;
                let ratio_nominator_diff_parentesis_close = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
                ratio_nominator_diff_parentesis_close.innerHTML = ")";
                let ratio_nominator_diff_square = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
                ratio_nominator_diff_square.innerHTML = "2";
                ratio_nominator_diff.appendChild(ratio_nominator_diff_parentesis_open);
                ratio_nominator_diff.appendChild(ratio_nominator_diff_minuend);
                ratio_nominator_diff.appendChild(ratio_nominator_diff_minus);
                ratio_nominator_diff.appendChild(ratio_nominator_diff_subtrahend);
                ratio_nominator_diff.appendChild(ratio_nominator_diff_parentesis_close);
                ratio_nominator.appendChild(ratio_nominator_diff);
                ratio_nominator.appendChild(ratio_nominator_diff_square);

                let ratio_denominator = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mn");
                ratio_denominator.innerHTML = `${common_infomed_stat.RoundToTwo(matrix[i][j].expectation)}`;

                let ratio = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mfrac");
                ratio.appendChild(ratio_nominator);
                ratio.appendChild(ratio_denominator);

                math_tag.appendChild(ratio);

                // if (j == matrix[0].length - 1) {
                //     let ellipsis = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
                //     ellipsis.innerHTML = "...";
                //     math_tag.appendChild(ellipsis);
                // }

            }
        }

        let equal_sign2 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
        equal_sign2.innerHTML = "=";
        math_tag.appendChild(equal_sign2);

        let chi_square_tag = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mn");
        chi_square_tag.innerHTML = `${common_infomed_stat.RoundToTwo(chi_square)}`;
        math_tag.appendChild(chi_square_tag);

        return math_tag;
    }

    _GetEquation_old(matrix) {
        let chi_square = 0;
        let equation1 = "";
        let equation2 = "";
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                const curr = Math.pow(matrix[i][j].observation - matrix[i][j].expectation, 2) / matrix[i][j].expectation;
                chi_square += curr;

                // condition makes long formula more readable
                if (i == 0) {
                    equation1 += equation1.length > 0 ? " + " : "";
                    equation1 += `{ { ( ${common_infomed_stat.RoundToTwo(matrix[i][j].observation)} - ${common_infomed_stat.RoundToTwo(matrix[i][j].expectation)} ) } ^2 \\over ${common_infomed_stat.RoundToTwo(matrix[i][j].expectation)} }`;
                }

                equation2 += equation2.length > 0 ? " + " : "";
                equation2 += `${common_infomed_stat.RoundToTwo(curr)}`;
            }
        }

        equation1 += " + ... ";
        equation2 += ` = ${common_infomed_stat.RoundToTwo(chi_square)}`;
        return "χ2 = \\(" + equation1 + "\\) = " + equation2 + " ";
        // return "χ2 = " + equation2 + " ";
    }

    _GetChiSquare(matrix) {
        let chi_square = 0;
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                chi_square += Math.pow(matrix[i][j].observation - matrix[i][j].expectation, 2) / matrix[i][j].expectation;
            }
        }

        return chi_square;
    }

    _GetValidity(matrix) {
        let flag = true;
        let message = "";

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (matrix[i][j].expectation < this.validity_threshold) {
                    flag = false;
                    message += message.length > 0 ? ", " : "";
                    message += `E(${i+1},${j+1}) = ${common_infomed_stat.RoundToTwo(matrix[i][j].expectation)}`;
                }
            }
        }

        let tag0 = document.createElement("div");

        let tag1 = document.createElement("div");
        tag1.innerHTML = `Вычисления считаются корректными, только если минимальное значение в таблице ожиданий &gt;= ${this.validity_threshold}`;

        let tag2 = document.createElement("span");
        if (flag) {
            tag2.className = "alert alert-success fa fa-check";
            tag2.innerHTML = "&nbsp; Вычисления можно применять";
        } else {
            tag2.className = "alert alert-danger fa fa-times";
            tag2.innerHTML = `&nbsp; Вычисления применять нельзя, так как ${message}`;
        }

        tag0.appendChild(tag1);
        tag0.appendChild(tag2);

        return tag0;
    }

    _GetConclusion(matrix) {
        const chi_square = this._GetChiSquare(matrix);
        const df = (matrix.length - 1) * (matrix[0].length - 1);
        const chi_table_row = ChiTable.data[df];

        let tag_parent = document.createElement("div");
        for (let i = 0; i < chi_table_row.length; i++) {
            let tag_child = document.createElement("div");
            if (chi_square < chi_table_row[i]) {
                tag_child.className = "fa fa-check";
                tag_child.innerHTML = `&nbsp; Нет оснований отклонять H0, потому что ${common_infomed_stat.RoundToTwo(chi_square)} < ${chi_table_row[i]}. Статистически при a = ${ChiTable.percentile[i]} группы <b>независимы</b>`;
            } else {
                tag_child.className = "fa fa-times";
                tag_child.innerHTML = `&nbsp; Есть основания отклонмть H0, потому что ${common_infomed_stat.RoundToTwo(chi_square)} >= ${chi_table_row[i]}. Есть статистически значимые доказательства при a = ${ChiTable.percentile[i]} показывающие, что H0 ложно или группы не независимы (те. группы в исследовании зависимы)`;
            }
            tag_parent.appendChild(tag_child);
        }

        return tag_parent;
    }

	_AddExplanations(explanation_id, text) {
		document.querySelector(`[${explanation_id}]`).innerHTML = text;
	}

    UpdateUI(matrix) {
		this._AddExplanations("chi-observations-explanation", "Выбывшие пациенты учитываются в группе выживших.");
        
        const tag_equation = document.querySelector("[chi-square-equation]");
        while (tag_equation.firstChild) {
            tag_equation.removeChild(tag_equation.firstChild);
        }
        tag_equation.appendChild(this._GetEquation(matrix));

        
        const tag_validity = document.querySelector("[chi-square-validity]");
        while (tag_validity.firstChild) {
            tag_validity.removeChild(tag_validity.firstChild);
        }
        tag_validity.appendChild(this._GetValidity(matrix));
        
        const tag_conclusion = document.querySelector("[chi-square-conclusion]");
        while (tag_conclusion.firstChild) {
            tag_conclusion.removeChild(tag_conclusion.firstChild);
        }
        tag_conclusion.appendChild(this._GetConclusion(matrix));
    }
}
