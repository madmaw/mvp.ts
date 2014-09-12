module TS.MVP.Form {
    export class DirectValueFormModel<ValueType> extends AbstractModel implements IValueFormModel<ValueType> {

        private _errors: string[];
        private _value: ValueType;
        private _modified: boolean;

        constructor() {
            super();
            this._modified = false;
        }

        getErrors(): string[] {
            return this._errors;
        }

        setError(error: any) {
            this._errors = <string[]>error;
            this._fireModelChangeEvent(null, true);
        }

        setValue(value: any, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            this._value = value;
            this._modified = true;
            if(!suppressModelChangeEvent ) {
                this._fireModelChangeEvent(null, suppressStateChangeEvent);
            }
        }

        getValue(into?: any) {
            return this._value;
        }

        clearError(): void {
            this._modified = false;
            this._errors = [];
            this._fireModelChangeEvent(null, true);
        }

        exportState() {
            return this.getValue();
        }


    }
}