module TS.IJQuery.MVP.Form {
    export class InnerTextValueFormJQueryPresenter extends AbstractFormJQueryPresenter<TS.MVP.Form.IValueFormModel<any>> {

        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            errorSelector: string,
            errorFormatter: IErrorFormatter,
            errorClass: string,
            private _elementSelector: string
            ) {
            super(viewFactory, errorSelector, errorFormatter, errorClass);
        }

        _doLoad(model: TS.MVP.Form.IValueFormModel<string>) {
            super._doLoad(model);

            this.$(this._elementSelector).text(model.getValue());
        }

    }
}