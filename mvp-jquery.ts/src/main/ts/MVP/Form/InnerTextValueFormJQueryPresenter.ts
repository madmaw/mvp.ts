module TS.IJQuery.MVP.Form {
    export class InnerTextValueFormJQueryPresenter<ValueType> extends AbstractFormJQueryPresenter<TS.MVP.Form.IFormModel<ValueType, any>> {

        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            errorSelector: string,
            errorFormatter: IErrorFormatter,
            errorClass: string,
            private _elementSelector: string,
            private _formatter?: (value:ValueType)=>any
        ) {
            super(viewFactory, errorSelector, errorFormatter, errorClass);
        }

        _doLoad(model: TS.MVP.Form.IFormModel<ValueType, any>) {
            super._doLoad(model);
            var value = model.getValue();
            var formattedValue: any;
            if( this._formatter ) {
                formattedValue = this._formatter(value);
            } else {
                formattedValue = value;
            }
            this.$(this._elementSelector).text(formattedValue);
        }

    }
}