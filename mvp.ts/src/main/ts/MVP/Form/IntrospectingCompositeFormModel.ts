module TS.MVP.Form {
    export class IntrospectingCompositeFormModel<ValueType> extends TS.MVP.Composite.MappedKeyedCompositePresenterModel implements IFormModel<ValueType, ValueType> {

        private _value: any;
        public _errors: string[];
        private _modified: boolean;
        private _showErrors: boolean;
        public _completionListener: ()=> void;
        private _subordinateValueChangeListener: IModelChangeListener;

        constructor(presenterMap: {[_:string]: IPresenterWithModel<IFormModel<any, any>>}, private _focusModel?: IFormModel<any, any>) {
            super(presenterMap);
            this._subordinateValueChangeListener = (source: IModel, event: ModelChangeEvent) => {
                // is it a value change?
                var description = event.lookup(FormModelValueChangeDescription.CHANGE_TYPE_FORM_VALUE);
                if( description != null ) {
                    this._fireModelChangeEvent(description, true);
                }
            };
        }

        public setValue(value: ValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            this.setSourceValue(value, notModified, suppressModelChangeEvent, suppressStateChangeEvent);
        }

        public getSourceValue() {
            return this._value;
        }

        public setSourceValue(value: ValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            this._value = value;
            this._modified = this._modified || !notModified;
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel<any, any>>>presenter).getModel();
                var fieldValue;
                if( value == null ) {
                    fieldValue = null;
                } else {
                    fieldValue = value[key];
                }
                model.setValue(fieldValue, false, false || suppressModelChangeEvent, true);
            }
            if( !suppressStateChangeEvent ) {
                this._fireStateChangeEvent(this, null);
            }
        }

        public getValue() {
            var into: ValueType = <any>{};
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel<any, any>>>presenter).getModel();
                var fieldValue = model.getValue();
                into[key] = fieldValue;
            }
            return into;
        }

        clear(): void {
            this._modified = false;
            this._showErrors = false;
            this._errors = [];
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel<any, any>>>presenter).getModel();
                model.clear();
            }
            // TODO indicate that it's the validation errors that have changed (only)
            this._fireModelChangeEvent(null, true);
        }


        setSourceError(error: IFormError, forceShow?:boolean) {
            if( error != null ) {
                this._errors = error.errors;
            } else {
                this._errors = null;
            }
            this._showErrors = forceShow || this._showErrors;
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel<any, any>>>presenter).getModel();
                var fieldValue;
                if( error == null || error.children == null ) {
                    fieldValue = null;
                } else {
                    fieldValue = error.children[key];
                }
                model.setSourceError(fieldValue, forceShow && fieldValue != null);
            }
            // indicate that it's the validation errors that have changed (only) - this reloads the entire page!
            this._fireModelChangeEvent(new FormModelErrorChangeDescription(this.getErrors()), true);
        }

        getErrors(): string[] {
            if( this._modified || this._showErrors ) {
                return this._errors;
            } else {
                return this._errors;
            }
        }

        exportState() {
            return this.getValue();
        }

        isModified() {
            return this._modified;
        }

        requestFocus() {
            if( this._focusModel ) {
                this._focusModel.requestFocus();
            }
        }

        setCompletionListener(completionListener: ()=>void) {
            this._completionListener = completionListener;
        }

        requestComplete() {
            if( this._completionListener ) {
                this._completionListener();
            }
        }

        _startedListening() {
            super._startedListening();
            // proxy changes back
            var added: IModel[] = [];
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = presenter.getModel();
                if( !TS.arrayContains(added, model) ) {
                    model.addChangeListener(this._subordinateValueChangeListener);
                    added.push(model);
                }
            }
        }

        _stoppedListening() {
            super._stoppedListening();
            // stop reporting changes
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = presenter.getModel();
                model.removeChangeListener(this._subordinateValueChangeListener);
            }
        }
    }

}