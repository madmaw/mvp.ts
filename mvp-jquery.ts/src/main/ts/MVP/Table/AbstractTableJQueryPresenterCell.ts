module TS.JQuery.MVP.Table {

    export class AbstractTableJQueryPresenterCell {
        constructor(
            public container: JQuery,
            public presenter: TS.JQuery.MVP.IJQueryPresenter
        ) {
        }
    }

}