module TS.IJQuery.MVP.Form {

    export class CompositeFormJQueryPresenter<ModelType extends TS.MVP.Form.ICompositeFormModel<any>> extends TS.IJQuery.MVP.Composite.KeyedCompositeJQueryPresenter<ModelType> {


        constructor(
            viewFactory: IJQueryViewFactory,
            keysToSelectors?: {[_:string]: string},
            private _errorSelector?: string,
            private _errorFormatter?: IErrorFormatter,
            private _errorClass?: string
        ) {
            super(viewFactory, keysToSelectors);
        }

        public _handleModelChangeEvent(event:TS.MVP.ModelChangeEvent):void {
            var errorDescription: TS.MVP.Form.FormModelErrorChangeDescription = <any>event.lookupExclusive(TS.MVP.Form.FormModelErrorChangeDescription.CHANGE_TYPE_FORM_ERROR);
            if( errorDescription ) {
                this._showErrors(errorDescription.errors);
            } else {
                var valueDescription = event.lookupExclusive(TS.MVP.Form.FormModelValueChangeDescription.CHANGE_TYPE_FORM_VALUE);
                if( valueDescription == null ) {
                    // do not want to reload on a value change
                    super._handleModelChangeEvent(event);
                }
            }
        }

        public _doLoad(model: ModelType) {
            var errors = model.getErrors();
            this._showErrors(errors);
            // note, doLoad includes a call to layout
            super._doLoad(model);
        }

        public _showErrors(errors: string[] ) {
            if( this._errorSelector !== undefined && this._errorFormatter ) {
                // present any errors
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
        }
    }
}