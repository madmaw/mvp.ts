module TS.IJQuery.MVP.Form {

    export class CompositeFormJQueryPresenter<ModelType extends TS.MVP.Form.ICompositeFormModel<any>> extends TS.IJQuery.MVP.Composite.KeyedCompositeJQueryPresenter<ModelType> {


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
            if( this._errorSelector !== undefined && this._errorFormatter ) {
                // present any errors
                var errors = model.getErrors();
                var errorString = this._errorFormatter(errors);
                var errorJQuery = this.$(this._errorSelector);
                errorJQuery.html(errorString);
                if( this._errorClass ) {
                    if( errors != null && errors.length > 0 ) {
                        this.$().addClass(this._errorClass);
                    } else {
                        this.$().removeClass(this._errorClass);
                    }
                }
            }
            // note, doLoad includes a call to layout
            super._doLoad(model);
        }

    }
}