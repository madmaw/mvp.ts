module TS.IJQuery {

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

    export function jqueryDeferredProgressWhen(promises: JQueryPromise<any>[]): JQueryPromise<any> {
        var deferred: JQueryDeferred<any> = new jQuery.Deferred();
        var newPromises: JQueryPromise<any>[] = [deferred];
        var progress = 0;
        for (var i in promises) {
            var promise = promises[i];
            var newPromise = promise.then(function () {
                progress++;
                deferred.notify(progress);
                if (progress == promises.length) {
                    // we finish when everything else does
                    deferred.resolve();
                }
            });
            newPromises.push(newPromise);
        }
        return $.when.apply($, newPromises);
    }


}