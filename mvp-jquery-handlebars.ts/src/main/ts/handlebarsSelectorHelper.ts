module TS.IJQuery.Template.HB {

    export function handlbarsSelectorHelper(selector: string, extraClasses?:any): string {
        var result;
        var classesHandled;
        if (!(extraClasses instanceof String)) {
            extraClasses = null;
        }
        if (selector) {
            selector = selector.trim();
            if (selector.length > 0) {
                var first = selector.charAt(0);
                switch (first) {
                    case '.':
                        result = "class='" + selector.substring(1) + (extraClasses?(" " + extraClasses):"") + "'";
                        classesHandled = true;
                        break;
                    case '#':
                        result = " id='" + selector.substring(1) + "'";
                        classesHandled = false;
                        break;
                    default:
                        // should ignore, we assume that it's selecting on the tag and there's nothing we can do either way
                        result = "name='"+selector+"'";
                        classesHandled = false;
                        break;
                }
            } else {
                result = "";
                classesHandled = false;
            }
        } else {
            result = "";
            classesHandled = false;
        }
        if (!classesHandled && extraClasses != null && extraClasses.length > 0) {
            var classString = "class = '" + extraClasses + "'";
            if (result != null) {
                if (result.length > 0) {
                    result += " ";
                }
                result += classString;
            } else {
                result = classString;
            }
        }
        return new Handlebars.SafeString(result);
    }

}