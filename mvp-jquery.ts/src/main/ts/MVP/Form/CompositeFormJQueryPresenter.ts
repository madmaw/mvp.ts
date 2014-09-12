module TS.IJQuery.MVP.Form {

    export class CompositeFormJQueryPresenter<ModelType extends TS.MVP.Form.ICompositeFormModel> extends TS.IJQuery.MVP.Composite.KeyedCompositeJQueryPresenter<ModelType> {


        constructor(
            viewFactory: IJQueryViewFactory,
            keysToSelectors: {[_:string]: string},
            private _errorSelector: string,
            private _errorFormatter: IErrorFormatter,
            private _errorClass: string
        ) {
            super(viewFactory, keysToSelectors);
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