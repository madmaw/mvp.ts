// Module
module TS {

    export function arrayRemoveElement(array: any[], element:any): boolean {
        var result: boolean = false;
        var index = array.length;
        while (index > 0) {
            index--;
            var found = array[index];
            if (found == element) {
                result = true;
                array.splice(index, 1);
                break;
            }
        }
        return result;
    }

    export function arrayPushAll(into: any[], elements: any[]) {
        for (var i in elements) {
            var element = elements[i];
            into.push(element);
        }
    }

    export function arrayCopy(array: any[]) {
        return [].concat(array);
    }

    export function arrayCreate2DArray(width: number, height: number):any[][] {
        var array = new Array(width);
        for (var i = 0; i < width; i++) {
            array[i] = new Array(height);
        }
        return array;
    }
}

