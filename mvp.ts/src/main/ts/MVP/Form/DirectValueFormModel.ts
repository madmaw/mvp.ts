module TS.MVP.Form {
    export class DirectValueFormModel<ValueType> extends AbstractModel implements IFormModel<ValueType> {

        private _errors: string[];
        public _value: ValueType;
        public _modified: boolean;
        public _completionListener: ()=> void;

        constructor() {
            super();
            this._modified = false;
        }

        getErrors(): string[] {
            if( this._modified ) {
                return this._errors;
            } else {
                return null;
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

        // fires a special focus event
        requestFocus() {
            this._fireModelChangeEvent(FORM_FIELD_FOCUS_MODEL_CHANGE, true);
        }


        setError(error: IFormError, forceShow?:boolean) {
            if( error ) {
                this._errors = error.errors;
            } else {
                this._errors = null;
            }
            if( forceShow ) {
                this._modified = true;
            }
            this._fireModelChangeEvent(null, true);
        }

        setValue(value: ValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            this._value = value;
            this._modified = this._modified || !notModified;
            if(!suppressModelChangeEvent ) {
                this._fireModelChangeEvent(null, suppressStateChangeEvent);
            }
        }

        getValue(into?: ValueType) {
            return this._value;
        }

        clear(): void {
            this._modified = false;
            this._errors = [];
            this._fireModelChangeEvent(null, true);
        }

        exportState() {
            return this.getValue();
        }

        isModified() {
            return this._modified;
        }

    }
}