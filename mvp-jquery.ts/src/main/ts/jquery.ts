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

    export function jqueryDeferredProgressWhen(promises: JQueryPromise<any>[], beforePromise?: JQueryPromise<any>, initProgress?: number): JQueryPromise<any> {
        var deferred: JQueryDeferred<any> = new jQuery.Deferred();
        var progress = initProgress;
        if( progress == null ) {
            if( beforePromise ) {
                progress = 1;
            } else {
                progress = 0;
            }
        }
        var promiseFunction = function() {
            for (var i in promises) {
                var promise = promises[i];
                promise.then(function () {
                    progress++;
                    deferred.notify(progress);
                    if (progress == promises.length) {
                        // we finish when everything else does
                        deferred.resolve();
                    }
                }).fail(function(e) {
                    deferred.reject(e);
                });
            }
        }
        if( beforePromise ) {
            beforePromise.then(function() {
                deferred.notify(progress);
                promiseFunction();
            }).fail(function(e) {
                deferred.reject(e);
            });
        } else {
            promiseFunction();
        }


        return deferred.promise();
    }


}