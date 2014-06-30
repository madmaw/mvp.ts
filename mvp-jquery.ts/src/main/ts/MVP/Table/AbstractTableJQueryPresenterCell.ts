module TS.IJQuery.MVP.Table {

    export class AbstractTableJQueryPresenterCell {
        constructor(
            public container: JQuery,
            public presenter: TS.IJQuery.MVP.IJQueryPresenter
        ) {
        }
    }

}