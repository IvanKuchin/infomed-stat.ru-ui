import Factorial from "./factorial.js";
// @ts-ignore
declare const common_infomed_stat: any;

export default class FishersExactTest {
    validity_threshold: number;
    constructor() {
        this.validity_threshold = 10;
    }

    _InputDataFromDatasets(datasets: any[], months: any[]): any[][] {
        const group_count = datasets.length;
        let matrix = new Array(group_count).fill(0).map(() => new Array(months.length + 1).fill(NaN));

        for (let i = 0; i < group_count; i++) {
            const total_patients = datasets[i].data.reduce((acc: number, curr: any) => acc + curr.Events + curr.Alive + curr.Censored, 0);
            for (let j = 0; j < months.length; j++) {
                const events_before_month = datasets[i].data.reduce((acc: number, curr: any) => {
                    return curr.Time < months[j] ? acc + curr.Events : acc;
                }, 0)
                matrix[i][j] = {
                    observation: total_patients - events_before_month,
                }
            }
            const items_before_last_month = datasets[i].data.filter((item: any) => item.Time < months[months.length - 1]);
            matrix[i][months.length] = {
                observation: items_before_last_month.reduce((acc: number, curr: any) => acc + curr.Events, 0),
            }
        }
        return matrix;
    }

    _Factorial(n: number): number {
        if (n == 0) {
            return 1;
        }
        return n * this._Factorial(n - 1);
    }

    _GetNumeratorAndDenominator(matrix: any[][]): { numerator: number[]; denominator: number[] } {
        const rows = matrix.length;
        const columns = matrix[0].length;
        let total_per_row = new Array(rows).fill(0);
        let total_per_column = new Array(columns).fill(0);
        for (let i = 0; i < total_per_row.length; i++) {
            total_per_row[i] = matrix[i].reduce((acc: number, curr: any) => acc + curr.observation, 0);
        }
        for (let j = 0; j < total_per_column.length; j++) {
            total_per_column[j] = matrix.reduce((acc: number, curr: any[]) => acc + curr[j].observation, 0);
        }
        const total = total_per_row.reduce((acc: number, curr: number) => acc + curr, 0);
        const numerator = total_per_row.concat(total_per_column);
        let denominator: number[] = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                denominator.push(matrix[i][j].observation);
            }
        }
        denominator.push(total);
        return { numerator, denominator };
    }

    _CalcP(matrix: any[][]): number {
        const { numerator, denominator } = this._GetNumeratorAndDenominator(matrix);
        const f = new Factorial();
        return f.calc_ratio(numerator, denominator);
    }

    _GetMaxIndexes(matrix: any[][]): { i_max: number; j_max: number } {
        let i_max = 0;
        let j_max = 0;
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (matrix[i][j].observation > matrix[i_max][j_max].observation) {
                    i_max = i;
                    j_max = j;
                }
            }
        }
        return { i_max, j_max };
    }

    _GetModifiedMatrix(i_max: number, j_max: number, curr: number, sum_per_row: number[], sum_per_column: number[]): any[][] {
        let matrix = new Array(sum_per_row.length).fill(0).map(() => new Array(sum_per_column.length).fill(NaN));
        matrix[i_max][j_max] = {
            observation: curr,
        }
        matrix[i_max][(j_max + 1) % 2] = {
            observation: sum_per_row[i_max] - matrix[i_max][j_max].observation,
        }
        matrix[(i_max + 1) % 2][j_max] = {
            observation: sum_per_column[j_max] - matrix[i_max][j_max].observation,
        }
        matrix[(i_max + 1) % 2][(j_max + 1) % 2] = {
            observation: sum_per_row[(i_max + 1) % 2] - matrix[(i_max + 1) % 2][j_max].observation,
        }
        return matrix;
    }

    _SkipMatrix(matrix: any[][]): boolean {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (matrix[i][j].observation < 0) {
                    return true;
                }
            }
        }
        return false;
    }

    _SumOfPLessThanCutoff(matrix: any[][]): number[] {
        const { i_max, j_max } = this._GetMaxIndexes(matrix);
        const max = matrix[i_max][j_max].observation;
        let p_array: number[] = [];
        const sum_per_row = matrix.map((row: any[]) => row.reduce((acc: number, curr: any) => acc + curr.observation, 0));
        const sum_per_column = matrix[0].map((_: any, index: number) => matrix.reduce((acc: number, curr: any[]) => acc + curr[index].observation, 0));
        for (let curr = 1; curr <= max; curr++) {
            const matrix_mod = this._GetModifiedMatrix(i_max, j_max, curr, sum_per_row, sum_per_column);
            if (this._SkipMatrix(matrix_mod)) {
                continue;
            }
            const { numerator, denominator } = this._GetNumeratorAndDenominator(matrix_mod);
            const f = new Factorial();
            const p = f.calc_ratio(numerator, denominator);
            p_array.push(p);
        }
        return p_array;
    }

    Calculate(datasets: any[], months: any[]): any[][] {
        let matrix = this._InputDataFromDatasets(datasets, months);
        return matrix;
    }

    _GetEquation(matrix: any[][]): Element {
        let math_tag = document.createElementNS("http://www.w3.org/1998/Math/MathML", "math");
        math_tag.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML");
        let left_side_sub = document.createElementNS("http://www.w3.org/1998/Math/MathML", "msub");
        let left_side_p = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
        left_side_p.innerHTML = "P";
        let left_side_cutoff = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
        left_side_cutoff.innerHTML = "cutoff";
        left_side_sub.appendChild(left_side_p);
        left_side_sub.appendChild(left_side_cutoff);
        let equal_sign = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
        equal_sign.innerHTML = "=";
        let frac_tag = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mfrac");
        let numerator_tag = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
        let denominator_tag = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
        const { numerator, denominator } = this._GetNumeratorAndDenominator(matrix);
        for (let i = 0; i < numerator.length; i++) {
            let factorial_part1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
            factorial_part1.innerHTML = numerator[i].toString();
            let factorial_part2 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
            factorial_part2.innerHTML = "!";
            let multiplier_tag = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
            multiplier_tag.innerHTML = " ";
            numerator_tag.appendChild(factorial_part1);
            numerator_tag.appendChild(factorial_part2);
            numerator_tag.appendChild(multiplier_tag);
        }
        for (let i = 0; i < denominator.length; i++) {
            let factorial_part1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
            factorial_part1.innerHTML = denominator[i].toString();
            let factorial_part2 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
            factorial_part2.innerHTML = "!";
            let multiplier_tag = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
            multiplier_tag.innerHTML = " ";
            denominator_tag.appendChild(factorial_part1);
            denominator_tag.appendChild(factorial_part2);
            denominator_tag.appendChild(multiplier_tag);
        }
        const f = new Factorial();
        const result = f.calc_ratio(numerator, denominator);
        let result_equal_sign = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
        result_equal_sign.innerHTML = "=";
        let result_tag = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mn");
        result_tag.innerHTML = result.toString();
        math_tag.appendChild(left_side_sub);
        math_tag.appendChild(equal_sign);
        math_tag.appendChild(frac_tag);
        frac_tag.appendChild(numerator_tag);
        frac_tag.appendChild(denominator_tag);
        math_tag.appendChild(result_equal_sign);
        math_tag.appendChild(result_tag);
        return math_tag;
    }

    _GetValidity(matrix: any[][]): { tag: Element; validity: boolean } {
        let flag = false;
        let message = `в таблице нет значений меньше ${this.validity_threshold}`;
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (matrix[i][j].observation < this.validity_threshold) {
                    flag = true;
                    message = "";
                }
            }
        }
        if (matrix.length != 2) {
            flag = false;
            message = "в таблице должно быть две строки";
        }
        if (matrix[0].length != 2) {
            flag = false;
            message = "в таблице должно быть два столбца";
        }
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if (matrix[i][j].observation == 0) {
                    flag = false;
                    message = "в таблице ожиданий есть нулевые значения";
                }
            }
        }
        let tag0 = document.createElement("div");
        let tag1 = document.createElement("div");
        tag1.innerHTML = `Вычисления считаются корректными, только если в четырёхпольной таблице есть значения меньше ${this.validity_threshold}`;
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
        return {
            tag: tag0,
            validity: flag,
        };
    }

    _GetConclusion(p_cutoff: number, sum_of_p_less_than_p_cutoff: number): Element {
        const p_table = [0.005, 0.01, 0.025, 0.05, 0.1, 0.9, 0.95, 0.975, 0.99, 0.995].reverse();
        let tag_parent = document.createElement("div");
        for (let i = 0; i < p_table.length; i++) {
            let tag_child = document.createElement("div");
            if (sum_of_p_less_than_p_cutoff < p_table[i]) {
                tag_child.className = "fa fa-times";
                tag_child.innerHTML = `&nbsp; Есть основания отклонмть H0, потому что ${common_infomed_stat.RoundToFour(sum_of_p_less_than_p_cutoff)} < ${p_table[i]}. Есть статистически значимая связь между группами при a = ${p_table[i]}`;
            } else {
                tag_child.className = "fa fa-check";
                tag_child.innerHTML = `&nbsp; Нет оснований отклонять H0, потому что ${common_infomed_stat.RoundToFour(sum_of_p_less_than_p_cutoff)} >= ${p_table[i]}. Статистически при a = ${p_table[i]} группы <b>независимы</b>`;
            }
            tag_parent.appendChild(tag_child);
        }
        return tag_parent;
    }

    _AddExplanations(explanation_id: string, text: string): void {
        (document.querySelector(`[${explanation_id}]`) as HTMLElement).innerHTML = text;
    }

    _WarnIfFarFromOne(sum_of_p_array: number): void {
        const tag = document.querySelector("[fisher-p-sum]");
        while (tag && tag.firstChild) {
            tag.removeChild(tag.firstChild);
        }
        const new_tag = document.createElement("span");
        if (Math.abs(sum_of_p_array - 1) > 0.1) {
            new_tag.innerHTML = `Сумма других возможных p-матриц ${common_infomed_stat.RoundToFour(sum_of_p_array)} далека от 1. Вычисления нельзя считать корректными. Попробуйте поменять период выживаемости`;
            new_tag.className = "alert alert-danger fa";
        } else {
            new_tag.innerHTML = `Сумма других возможных p-матриц ${common_infomed_stat.RoundToFour(sum_of_p_array)} близка к 1.`;
            new_tag.className = "alert alert-success fa";
        }
        if (tag) tag.appendChild(new_tag);
    }

    UpdateUI(matrix: any[][]): void {
        this._AddExplanations("fisher-observations-explanation", "Выбывшие пациенты учитываются в группе выживших.");
        const tag_equation = document.querySelector("[fisher-equation]");
        while (tag_equation && tag_equation.firstChild) {
            tag_equation.removeChild(tag_equation.firstChild);
        }
        const tag_conclusion = document.querySelector("[fisher-conclusion]");
        while (tag_conclusion && tag_conclusion.firstChild) {
            tag_conclusion.removeChild(tag_conclusion.firstChild);
        }
        const tag_calc = document.querySelector("[fisher-calculation-matrix]");
        while (tag_calc && tag_calc.firstChild) {
            tag_calc.removeChild(tag_calc.firstChild);
        }
        const tag_validity = document.querySelector("[fisher-validity]");
        while (tag_validity && tag_validity.firstChild) {
            tag_validity.removeChild(tag_validity.firstChild);
        }
        const test_validity = this._GetValidity(matrix);
        if (tag_validity) tag_validity.appendChild(test_validity.tag);
        if (test_validity.validity == false) {
            return;
        }
        const gui_table = new _DrawGUIFishersTable();
        gui_table.Draw(matrix, "[fisher-calculation-matrix]");
        const p_cutoff = this._CalcP(matrix);
        const p_array = this._SumOfPLessThanCutoff(matrix);
        const sum_of_p_array = p_array.reduce((acc, curr) => acc + curr, 0);
        const sum_of_p_less_than_p_cutoff = p_array.reduce((acc, curr) => acc + (curr <= p_cutoff ? curr : 0), 0);
        this._WarnIfFarFromOne(sum_of_p_array);
        if (tag_equation) tag_equation.appendChild(this._GetEquation(matrix));
        if (tag_conclusion) tag_conclusion.appendChild(this._GetConclusion(p_cutoff, sum_of_p_less_than_p_cutoff));
    }
}

class _DrawGUIFishersTable {
    _getTableDOM(matrix: any[][], sum_per_row: number[], sum_per_column: number[], total: number, table_titles: string[]): HTMLTableElement {
        let table = document.createElement("table");
        table.className = "table table-striped";
        table.style.width = "100%";
        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        tr.appendChild(th);
        for (let i = 0; i < table_titles.length; i++) {
            let th = document.createElement("th");
            th.innerText = table_titles[i];
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);
        let tbody = document.createElement("tbody");
        for (let i = 0; i < matrix.length; i++) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.innerHTML = `<b>Группа ${i}</b>`;
            tr.appendChild(td);
            for (let j = 0; j < matrix[0].length; j++) {
                let td = document.createElement("td");
                td.innerText = matrix[i][j].observation;
                tr.appendChild(td);
            }
            td = document.createElement("td");
            td.innerText = sum_per_row[i].toString();
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
        tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerHTML = "<b>Сумма</b>";
        tr.appendChild(td);
        for (let i = 0; i < sum_per_column.length; i++) {
            let td = document.createElement("td");
            td.innerText = sum_per_column[i].toString();
            tr.appendChild(td);
        }
        td = document.createElement("td");
        td.innerText = total.toString();
        tr.appendChild(td);
        tbody.appendChild(tr);
        table.appendChild(tbody);
        return table;
    }

    Draw(matrix: any[][], selector: string): void {
        const sum_per_row = matrix.map((row: any[]) => row.reduce((acc: number, curr: any) => acc + curr.observation, 0));
        const sum_per_column = matrix[0].map((_: any, index: number) => matrix.reduce((acc: number, curr: any[]) => acc + curr[index].observation, 0));
        const total = sum_per_row.reduce((acc: number, curr: number) => acc + curr, 0);
        const table_titles = ["жив + выбыл", "умер", "Сумма"];
        const table_dom = this._getTableDOM(matrix, sum_per_row, sum_per_column, total, table_titles);
        let tag = document.querySelector(selector);
        while (tag && tag.firstChild) {
            tag.removeChild(tag.firstChild);
        }
        if (tag) tag.appendChild(table_dom);
    }
}
