module TS.MVP.Form {
    export class IntrospectingCompositeFormModel extends TS.MVP.Composite.MappedKeyedCompositePresenterModel implements IFormModel {

        private _value: any;
        private _errors: string[];

        constructor(presenterMap: {[_:string]: IPresenterWithModel<IFormModel>}) {
            super(presenterMap);
        }

        public setValue(value: any, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            this._value = value;
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel>>presenter).getModel();
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

        public getValue(into: any = {}) {
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel>>presenter).getModel();
                var fieldValue = model.getValue();
                into[key] = fieldValue;
            }
            return into;
        }

        clearError(): void {
            this._errors = [];
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel>>presenter).getModel();
                model.clearError();
            }
            // TODO indicate that it's the validation errors that have changed (only)
            this._fireModelChangeEvent(null, true);
        }


        setError(error: any) {
            var formError = <IFormError>error;
            this._errors = formError.errors;
            for( var key in this._presenterMap ) {
                var presenter = this._presenterMap[key];
                var model = (<IPresenterWithModel<IFormModel>>presenter).getModel();
                var fieldValue;
                if( formError == null || formError.children == null ) {
                    fieldValue = null;
                } else {
                    fieldValue = formError.children[key];
                }
                model.setError(fieldValue);
            }
            // TODO indicate that it's the validation errors that have changed (only)
            this._fireModelChangeEvent(null, true);
        }

        getErrors(): string[] {
            return this._errors;
        }

        exportState() {
            return this.getValue();
        }

    }

}