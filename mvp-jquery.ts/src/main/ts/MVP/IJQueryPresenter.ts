
module TS.IJQuery.MVP {

    export interface IJQueryPresenter extends TS.MVP.IPresenter {
        init(container: JQuery, prepend?: boolean): boolean;
    }


}