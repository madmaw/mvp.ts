module TS.MVP.Form {

    export class IntrospectingValueFormModel<ValueType, SourceValueType> extends AbstractModel implements IFormModel<ValueType, SourceValueType> {

        private _sourceValue: SourceValueType;
        public _sourceError: IFormError;
        private _modified: boolean;
        private _showErrors: boolean;
        public _completionListener: ()=> void;

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
            this._showErrors = forceShow;
            this._fireModelChangeEvent(new FormModelErrorChangeDescription(this.getErrors()), true);
        }

        setSourceValue(value: SourceValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            this._sourceValue = value;
            this._modified = !notModified;
            if(!suppressModelChangeEvent ) {
                this._fireModelChangeEvent(null, suppressStateChangeEvent);
            }
        }

        setValue(value: ValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            var oldValue = this.getValue();
            if( oldValue != value ) {
                this._sourceValue[this._key] = value;
                this._modified = this._modified || !notModified;
                if( !suppressModelChangeEvent ) {
                    this._fireModelChangeEvent(undefined, suppressStateChangeEvent);
                }
            }
        }

        getValue() {
            return this._sourceValue[this._key];
        }

        clear(): void {
            this._modified = false;
            this._sourceError = null;
            this._showErrors = false;
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