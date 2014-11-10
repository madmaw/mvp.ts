module TS.MVP.Form {

    export class IntrospectingPassthroughCompositeFormModel<ValueType, SourceValueType> extends PassthroughCompositeFormModel<ValueType, SourceValueType> {

        constructor(private _key: string, presenterMap: {[_:string]: IPresenterWithModel<IFormModel<any, ValueType>>}, focusModel?: IFormModel<any, ValueType>) {
            super(presenterMap, focusModel);
        }

        public setValue(value: ValueType, notModified?:boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            this._sourceValue[this._key] = value;
            this._modified = this._modified || !notModified;
            if( !suppressModelChangeEvent ) {
                this._fireModelChangeEvent(null, suppressStateChangeEvent);
            }
        }

        public getValue() {
            var result;
            if( this._sourceValue ) {
                result = this._sourceValue[this._key];
            } else {
                result = null;
            }
            return result;
        }

        getError(): IFormError {
            var result;
            if( this._sourceError && this._sourceError.children ) {
                result = this._sourceError.children[this._key];
            } else {
                result = null;
            }
            return result;
        }


    }

}