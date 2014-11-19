// Module
module TS {

    export function arrayRemoveElement<T>(array: T[], element:T): boolean {
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

    export function arrayContains<T>(array: T[], e:T) {
        return array != null && array.indexOf(e) >= 0;
    }

    export function arrayPushAll<T>(into: T[], elements: T[]) {
        for (var i in elements) {
            var element = elements[i];
            into.push(element);
        }
    }

    export function arrayCopy(array: any[]) {
        return [].concat(array);
    }

    export function arrayCreate2DArray<T>(width: number, height: number):T[][] {
        var array = new Array(width);
        for (var i = 0; i < width; i++) {
            array[i] = new Array(height);
        }
        return array;
    }
}

