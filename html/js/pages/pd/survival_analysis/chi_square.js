/*globals MathJax*/

import ChiTable from './chi_table.js';

export default class ChiSquare {
    constructor() {
        this.validity_threshold = 10;
    }

    _InputDataFromDatasets(datasets, months) {
        const group_count = datasets.length;
        let matrix = new Array(group_count).fill(0).map(() => new Array(months.length).fill(NaN));

        for (let i = 0; i < group_count; i++) {
            const total_patients = datasets[i].data.reduce((acc, curr) => acc + curr.Events, 0);
            for (let j = 0; j < months.length; j++) {

                const events_before_month = datasets[i].data.reduce((acc, curr) => {
                    return curr.Time < months[j] ? acc + curr.Events : acc;
                }, 0)

                matrix[i][j] = {
                    observation: total_patients - events_before_month,
                }
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
                    message += `E(${i},${j}) = ${common_infomed_stat.RoundToTwo(matrix[i][j].expectation)}`;
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
        const chi_table = new ChiTable();
        const chi_table_row = chi_table.data[df];

        let tag_parent = document.createElement("div");
        for (let i = 0; i < chi_table_row.length; i++) {
            let tag_child = document.createElement("div");
            if (chi_square < chi_table_row[i]) {
                tag_child.className = "fa fa-check";
                tag_child.innerHTML = `&nbsp; Нет оснований отклонять H0, потому что ${common_infomed_stat.RoundToTwo(chi_square)} < ${chi_table_row[i]}. Статистически при a = ${chi_table.percentile[i]} группы <b>независимы</b>`;
            } else {
                tag_child.className = "fa fa-times";
                tag_child.innerHTML = `&nbsp; Есть основания отклонмть H0, потому что ${common_infomed_stat.RoundToTwo(chi_square)} >= ${chi_table_row[i]}. Есть статистически значимые доказательства при a = ${chi_table.percentile[i]} показывающие, что H0 ложно или группы не независимы (те. группы в исследовании зависимы)`;
            }
            tag_parent.appendChild(tag_child);
        }

        return tag_parent;
    }

    UpdateUI(matrix) {
        
        const tag_equation = document.querySelector("[chi-square-equation]");
        tag_equation.innerText = this._GetEquation(matrix);

        
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

        // re-render MathJax
        // this is very expensive function and should be called only when needed
        // delay execution by few seconds
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            MathJax.startup.document.state(0);
            MathJax.texReset();
            MathJax.typeset();
        }, 3000);
    }
}
