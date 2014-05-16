module TS.JQuery.Template.HB {

    export function handlbarsSelectorHelper(selector: string, extraClasses:string = ""): string {
        var result;
        var classesHandled;
        if (selector) {
            selector = selector.trim();
            if (selector.length > 0) {
                var first = selector.charAt(0);
                switch (first) {
                    case '.':
                        result = "class='" + selector.substring(1) + " " + extraClasses + "'";
                        classesHandled = true;
                        break;
                    case '#':
                        result = " id='" + selector.substring(1) + "'";
                        classesHandled = false;
                        break;
                    default:
                        // ignore, we assume that it's selecting on the tag and there's nothing we can do either way
                        result = null;
                        classesHandled = false;
                        break;
                }
            } else {
                result = null;
                classesHandled = false;
            }
        } else {
            result = null;
            classesHandled = false;
        }
        if (!classesHandled && extraClasses != null && extraClasses.length > 0) {
            var classString = "class = '" + extraClasses + "'";
            if (result != null) {
                result += " " + classString;
            } else {
                result = classString;
            }
        }
        return new Handlebars.SafeString(result);
    }

}