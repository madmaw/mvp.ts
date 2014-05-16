module TS.JQuery.MVP {

    export class JQueryViewDescription {

        constructor(private _viewFactory: IJQueryViewFactory, private _viewParams: any) {
        }

        public createView(container: JQuery, prepend?:boolean): IJQueryView {
            return this._viewFactory(container, this._viewParams, prepend);
        }

    }

} 