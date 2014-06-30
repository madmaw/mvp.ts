// Module
module TS.IJQuery.MVP {
    export interface IJQueryViewFactory {
        (container: JQuery, params: any, prepend?: boolean):IJQueryView;
    }
}