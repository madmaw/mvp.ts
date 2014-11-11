module TS.MVP.Form {

    export class PassthroughCompositeFormModel<ValueType, SourceValueType>
        extends TS.MVP.Composite.MappedKeyedCompositePresenterModel
        implements IFormModel<ValueType, SourceValueType> {

        public _sourceValue: SourceValueType;
        public _sourceError: IFormError;
        public _modified: boolean;
        public _completionListener: ()=> void;

        constructor(presenterMap: {[_:string]: IPresenterWithModel<IFormModel<any, ValueType>>}, private _focusModel?: IFormModel<any, ValueType>) {
            super(presenterMap);
            this._modified = false;
            // pre-populate with empty value
            this.setSourceValue(<any>{}, true);
        }

        public getValue() {
            return <ValueType><any>this._sourceValue;
        }

        public setValue(value: ValueType, notModified?:boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            this.setSourceValue(<any>value, notModified, suppressModelChangeEvent, suppressStateChangeEvent);
        }

        public setSourceValue(sourceValue: SourceValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            this._sourceValue = sourceValue;
            var value = this.getValue();
            this._modified = this._modified || !notModified;
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel<any, ValueType>>>presenter).getModel();
                model.setSourceValue(value, notModified, false || suppressModelChangeEvent, true);
            }
            if( !suppressStateChangeEvent ) {
                this._fireStateChangeEvent(this, null);
            }
        }

        clear(): void {
            this._sourceError = null;
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel<any, ValueType>>>presenter).getModel();
                model.clear();
            }
            // TODO indicate that it's the validation errors that have changed (only)
            this._fireModelChangeEvent(null, true);
        }

        setSourceError(sourceError: IFormError, forceShow?:boolean) {
            this._sourceError = sourceError;
            var error = this.getError();
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel<any, ValueType>>>presenter).getModel();
                model.setSourceError(error, forceShow);
            }
            // TODO indicate that it's the validation errors that have changed (only) - this reloads the entire page!
            this._fireModelChangeEvent(null, true);
        }

        getError(): IFormError {
            return this._sourceError;
        }

        getErrors(error: IFormError = this.getError(), into: string[] = []): string[] {
            var result;
            if( error != null ) {
                result = error.errors;
            } else {
                result = null;
            }
            return result;
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