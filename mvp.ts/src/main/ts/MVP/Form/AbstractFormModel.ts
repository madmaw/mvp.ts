module TS.MVP.Form {
    export class AbstractFormModel<SubmittableType> extends AbstractModel implements IFormModel {

        private _formErrors: string[];
        private _fieldValidationErrors: {[_:string]: string[]};
        private _modified: {[_:string]: boolean };

        constructor(private _fieldHolder: SubmittableType) {
            super();
            this._fieldValidationErrors = {};
            this.resetModifiedFlags();
        }

        resetModifiedFlags() {
            this._modified = {};
        }

        getFieldValue(key: string): any {
            return this._fieldHolder[key];
        }

        setFieldValue(key: string, value: any, suppressStateChangeEvent?:boolean) {
            var remainingValidationErrors = {};
            for( var validationKey in this._fieldValidationErrors ) {
                var errors = this._fieldValidationErrors[validationKey];
                remainingValidationErrors[validationKey] = errors;
            }
            var existingValue = this._fieldHolder[key];
            if( existingValue != value ) {
                this._modified[key] = true;
                this._fieldHolder[key] = value;
                var validationErrors = this._doValidate(this._fieldHolder, key, value);
                var validationKeys = [];
                for( var validationKey in validationErrors ) {
                    var modified = this._modified[validationKey];
                    var previousValidationErrorItems = this._fieldValidationErrors[validationKey];
                    if( modified || previousValidationErrorItems && previousValidationErrorItems.length ) {
                        delete remainingValidationErrors[validationKey];
                        // only update modified entries or entries with existing errors
                        var validationErrorItems = validationErrors[validationKey];
                        this._fieldValidationErrors[validationKey] = validationErrorItems;
                        if( previousValidationErrorItems != null || validationErrorItems != null ) {
                            // TODO test for set equality a bit better than this
                            validationKeys.push(validationKey);
                        }
                    }
                }
                // remove unused validation errors
                for( var validationKey in remainingValidationErrors ) {
                    this._fieldValidationErrors[validationKey] = [];
                    validationKeys.push(validationKey);
                }

                // also remove any validation errors for modified values that no longer have validation errors
                this._fireModelChangeEvent(new FormFieldModelChangeDescription([key], validationKeys), suppressStateChangeEvent);
            }
        }


        getFieldValidationErrors(key: string): string[] {
            return this._fieldValidationErrors[key];
        }

        setFieldValidationErrors(fieldValidationErrors: {[_:string]:string[]}) {
            this._fieldValidationErrors = fieldValidationErrors;
            var fieldValidationErrorKeys = [];
            for( var key in fieldValidationErrors ) {
                fieldValidationErrorKeys.push(key);
            }
            // always suppress state change events (validation errors are derived from values)
            this._fireModelChangeEvent(new FormFieldModelChangeDescription([], fieldValidationErrorKeys), true);
        }

        getFormErrors(): string[] {
            return this._formErrors;
        }

        setFormErrors(formErrors: string[], suppressModelChangeEvent?:boolean) {
            this._formErrors = formErrors;
            // TODO don't redo everything
            if( !suppressModelChangeEvent ) {
                // always suppress state change events for this (errors are not persistent)
                this._fireModelChangeEvent(null, true);
            }
        }

        requestSubmit() {
            this.resetModifiedFlags();
            this._doRequestSubmit(this._fieldHolder);
        }

        _doRequestSubmit(toSubmit: SubmittableType) {
            // subclass should implement this

        }

        _doValidate(fieldHolder: SubmittableType, key: string, value: any): {[_:string]:string[]} {
            return null;
        }

        _clearFieldValidationErrors(suppressModelChangeEvent?: boolean, suppressStateChangeEvent?:boolean) {
            this.resetModifiedFlags();
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