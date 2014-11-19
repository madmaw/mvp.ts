module TS.IJQuery {

    export interface IJQueryCallback {
        (event: JQueryEventObject): void;
    }

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
        if( initProgress == null ) {
            if( beforePromise ) {
                initProgress = 1;
            } else {
                initProgress = 0;
            }
        }
        var progress = initProgress;
        var promiseFunction = function() {
            if( promises != null && promises.length > 0 ) {
                for (var i in promises) {
                    var promise = promises[i];
                    promise.then(function () {
                        progress++;
                        deferred.notify(progress);
                        if (progress == promises.length + initProgress) {
                            // we finish when everything else does
                            deferred.resolve();
                        }
                    }).fail(function(e) {
                        deferred.reject(e);
                    });
                }
            } else {
                // done, it's empty
                deferred.resolve();
            }
        };
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