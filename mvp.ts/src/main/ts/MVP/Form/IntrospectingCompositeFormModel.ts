module TS.MVP.Form {
    export class IntrospectingCompositeFormModel<ValueType> extends TS.MVP.Composite.MappedKeyedCompositePresenterModel implements IFormModel<ValueType> {

        private _value: any;
        private _errors: string[];
        private _modified: boolean;
        public _completionListener: ()=> void;

        constructor(presenterMap: {[_:string]: IPresenterWithModel<IFormModel<any>>}, private _focusModel?: IFormModel<any>) {
            super(presenterMap);
            this._modified = false;
        }

        public setValue(value: ValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            this._value = value;
            this._modified = this._modified || !notModified;
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel<ValueType>>>presenter).getModel();
                var fieldValue;
                if( value == null ) {
                    fieldValue = null;
                } else {
                    fieldValue = value[key];
                }
                model.setValue(fieldValue, false || suppressModelChangeEvent, true);
            }
            if( !suppressStateChangeEvent ) {
                this._fireStateChangeEvent(this, null);
            }
        }

        public getValue(into: ValueType = <any>{}) {
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel<ValueType>>>presenter).getModel();
                var fieldValue = model.getValue();
                into[key] = fieldValue;
            }
            return into;
        }

        clear(): void {
            this._errors = [];
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel<ValueType>>>presenter).getModel();
                model.clear();
            }
            // TODO indicate that it's the validation errors that have changed (only)
            this._fireModelChangeEvent(null, true);
        }


        setError(error: IFormError, forceShow?:boolean) {
            if( error != null ) {
                this._errors = error.errors;
            } else {
                this._errors = null;
            }
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel<any>>>presenter).getModel();
                var fieldValue;
                if( error == null || error.children == null ) {
                    fieldValue = null;
                } else {
                    fieldValue = error.children[key];
                }
                model.setError(fieldValue, forceShow && fieldValue != null);
            }
            // TODO indicate that it's the validation errors that have changed (only) - this reloads the entire page!
            this._fireModelChangeEvent(null, true);
        }

        getErrors(): string[] {
            return this._errors;
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

    }

}