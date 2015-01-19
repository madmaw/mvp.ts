// Module
module TS {

    export function stringFormat(format: string, params: any[]): string {
        var anyFormat = <any>format;
        var result;
        if (anyFormat.format) {
            // do it natively
            result = anyFormat.format.apply(anyFormat, params);
        } else {
            // do it using regex
            var f = function (match:string, num?:string) : string {
                return typeof params[num] != 'undefined'
                    ? params[num]
                    : match
                    ;
            };
            result = format.replace(<string><any>(/{(\d+)}/g), f);
        }
        return result;
    }

    export function stringEndsWith(s:string, suffix:string): boolean {
        return s.indexOf(suffix, s.length - suffix.length) != -1;
    }

}

