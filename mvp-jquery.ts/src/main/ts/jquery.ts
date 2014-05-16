module TS.JQuery {

    // additional jQuery functions
    export function jquerySelectFromRoot(jquery:JQuery, selector?:string, childFilter?:(index:number)=>boolean) {
        var result:JQuery;
        if (selector) {
            // refine 
            // include roots
            var self = jquery.filter(selector);
            // include children
            var children = jquery.find(selector)
            if (childFilter) {
                children = children.filter(childFilter);
            }
            result = children.add(self);
        } else {
            result = jquery
        }
        return result;
    }

}