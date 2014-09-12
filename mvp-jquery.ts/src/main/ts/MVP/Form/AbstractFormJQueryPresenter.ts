module TS.IJQuery.MVP.Form {

    export class AbstractFormJQueryPresenter<ModelType extends TS.MVP.Form.IFormModel> extends AbstractJQueryPresenter<ModelType> {

        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            private _errorSelector: string,
            private _errorFormatter: IErrorFormatter,
            private _errorClass: string
        ) {
            super(viewFactory)
        }

        public _doLoad(model: ModelType) {
            super._doLoad(model);
            // present any errors
            var errors = model.getErrors();
            var errorString = this._errorFormatter(errors);
            var errorJQuery = this.$(this._errorSelector);
            errorJQuery.html(errorString);
            if( errors != null && errors.length > 0 ) {
                this.$().addClass(this._errorClass);
            } else {
                this.$().removeClass(this._errorClass);
            }
        }

    }

}