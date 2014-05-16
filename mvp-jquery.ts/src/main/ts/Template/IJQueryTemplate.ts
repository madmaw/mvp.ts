module TS.JQuery.Template {

    export interface IJQueryTemplate<T> {
        (t: T): JQuery;
    }

} 