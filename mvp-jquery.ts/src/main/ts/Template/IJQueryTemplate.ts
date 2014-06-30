module TS.IJQuery.Template {

    export interface IJQueryTemplate<T> {
        (t: T): JQuery;
    }

} 