module TS.MVP.Form {

    export class IntrospectingValueFormModel<ValueType, SourceValueType> extends AbstractModel implements IFormFieldModel<ValueType, SourceValueType> {

        private _sourceValue: SourceValueType;
        public _sourceError: IFormError;
        private _modified: boolean;
        private _showErrors: boolean;
        public _completionListener: ()=> void;
        private _defaultValue: ValueType;

        constructor(public _key: string) {
            super();
        }

        getErrors(): string[] {
            var result: string[] = null;
            if( (this._modified || this._showErrors) && this._sourceError ) {
                var children = this._sourceError.children;
                if( children ) {
                    var child: IFormError = children[this._key];
                    if( child ) {
                        result = child.errors;
                    }
                }
            }
            return result;
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


        setSourceError(error: IFormError, forceShow?:boolean) {
            this._sourceError = error;
            this._showErrors = forceShow || this._showErrors;
            this._fireModelChangeEvent(new FormModelErrorChangeDescription(this.getErrors()), true);
        }

        getSourceValue() {
            return this._sourceValue;
        }

        setSourceValue(value: SourceValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            this._sourceValue = value;
            this._modified = !notModified;
            if(!suppressModelChangeEvent ) {
                this._fireModelChangeEvent(new FormModelValueChangeDescription(), suppressStateChangeEvent);
            }
        }

        setValue(value: ValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            var oldValue = this.getValue();
            // can force an update by explicitly specifying notModified
            if( oldValue != value || notModified === false ) {
                this._sourceValue[this._key] = value;
                this._modified = this._modified || !notModified;
                if( !suppressModelChangeEvent ) {
                    this._fireModelChangeEvent(new FormModelValueChangeDescription(), suppressStateChangeEvent);
                }
            }
        }

        getValue(key: string = this._key) {
            return this._sourceValue[key];
        }

        clear(): void {
            this._modified = false;
            this._sourceError = null;
            this._showErrors = false;
            this._fireModelChangeEvent(new FormModelValueChangeDescription(), true);
        }

        exportState() {
            return this.getValue();
        }

        isModified() {
            return this._modified;
        }

        getDefaultValue() {
            return this._defaultValue;
        }

        setDefaultValue(defaultValue: ValueType) {
            this._defaultValue = defaultValue;
            this._fireModelChangeEvent(null, true);
        }

    }

}