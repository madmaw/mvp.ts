
// Module
module TS.IJQuery.MVP {
    export interface IJQueryView extends TS.MVP.IView {

        $: JQuery

        ownsSelf: boolean;
    }
}