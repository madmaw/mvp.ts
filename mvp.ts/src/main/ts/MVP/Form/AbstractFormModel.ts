module TS.MVP.Form {
    export class AbstractFormModel<SubmittableType> extends AbstractModel implements IFormModel {

        private _formErrors: string[];
        private _fieldValidationErrors: {[_:string]: string[]};

        constructor(private _fieldHolder: SubmittableType) {
            super();
            this._fieldValidationErrors = {};
        }

        getFieldValue(key: string): any {
            return this._fieldHolder[key];
        }

        setFieldValue(key: string, value: any, suppressStateChangeEvent?:boolean) {
            var existingValue = this._fieldHolder[key];
            if( existingValue != value ) {
                this._fieldHolder[key] = value;
                // TODO check that validation errors haven't changed
                var validationErrors = this._doValidate(this._fieldHolder, key, value);
                var validationKeys = [];
                if( validationErrors != null ) {
                    for( var validationKey in validationErrors ) {
                        validationKeys.push(validationKey);
                        var validationErrorItems = validationErrors[validationKey];
                        this._fieldValidationErrors[validationKey] = validationErrorItems;
                    }
                }
                this._fireModelChangeEvent(new FormFieldModelChangeDescription([key], validationKeys), suppressStateChangeEvent);
            }
        }


        getFieldValidationErrors(key: string): string[] {
            return this._fieldValidationErrors[key];
        }

        getFormErrors(): string[] {
            return this._formErrors;
        }

        setFormErrors(formErrors: string[], suppressModelChangeEvent?:boolean, suppressStateChangeEvent?:boolean) {
            this._formErrors = formErrors;
            // TODO don't redo everything
            if( !suppressModelChangeEvent ) {
                this._fireModelChangeEvent();
            }
        }

        requestSubmit() {
            this._doRequestSubmit(this._fieldHolder);
        }

        _doRequestSubmit(toSubmit: SubmittableType) {
            // subclass should implement this

        }

        _doValidate(fieldHolder: SubmittableType, key: string, value: any): {[_:string]:string[]} {
            return null;
        }

        _clearFieldValidationErrors(suppressModelChangeEvent?: boolean, suppressStateChangeEvent?:boolean) {
            var keys = [];
            for( var key in this._fieldValidationErrors) {
                keys.push(key);
            }
            this._fieldValidationErrors = {};
            if( !suppressModelChangeEvent ) {
                this._fireModelChangeEvent(new FormFieldModelChangeDescription([], keys), suppressStateChangeEvent);
            }
        }


    }

}