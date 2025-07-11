export default class Factorials {
    private _expand(arr: number[]): number[] {
        let result: number[] = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i]; j++) {
                result.push(j + 1);
            }
        }
        return result;
    }

    private _eliminate_common_factors(expanded_nominator: number[], expanded_denominator: number[]): { nominator: number[]; denominator: number[] } {
        let result: number[] = [];
        for (let i = 0; i < expanded_nominator.length; i++) {
            let index = expanded_denominator.indexOf(expanded_nominator[i]);
            if (index === -1) {
                result.push(expanded_nominator[i]);
            } else {
                expanded_denominator.splice(index, 1);
            }
        }

        if (expanded_denominator.length === 0) {
            expanded_denominator.push(1);
        }
        if (result.length === 0) {
            result.push(1);
        }

        return { nominator: result, denominator: expanded_denominator };
    }

    private _calculate(nominator: number[], denominator: number[]): number {
        const max = Math.max(nominator.length, denominator.length);
        let result = 1;

        for (let i = 0; i < max; i++) {
            const curr_nominator = nominator[i] || 1;
            const curr_denominator = denominator[i] || 1;
            result *= curr_nominator / curr_denominator;
        }

        return result;
    }

    public calc_ratio(nominator: number[], denominator: number[]): number {
        let expanded_nominator = this._expand(nominator);
        let expanded_denominator = this._expand(denominator);
        const short = this._eliminate_common_factors(expanded_nominator, expanded_denominator);

        return this._calculate(short.nominator, short.denominator);
    }
}

// let s = new Factorials();
// console.log(s.calc_ratio([707, 23, 497, 233], [342, 365, 155, -132, 730]));
// console.log(s.calc_ratio([771, 772, 773], [770, 771, 772]));
// console.log(s.calc_ratio([770, 771, 772], [771, 772, 773]));
// console.log(s.calc_ratio([770, 771, 772, 3], [770, 771, 772, 4]));
// console.log(s.calc_ratio([770, 771, 772, 4], [770, 771, 772, 3]));
// console.log(s.calc_ratio([770, 771, 772], [770, 771, 772, 3]));
// console.log(s.calc_ratio([770, 771, 772, 3], [770, 771, 772]));

