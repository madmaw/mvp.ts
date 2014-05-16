// Module
module TS.JQuery.MVP {
    export interface IJQueryViewFactory {
        (container: JQuery, params: any, prepend?: boolean):IJQueryView;
    }
}