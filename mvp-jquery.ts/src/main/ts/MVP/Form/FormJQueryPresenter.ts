module TS.IJQuery.MVP.Form {

    export class FormJQueryPresenter<ModelType extends TS.MVP.Form.IFormModel> extends AbstractJQueryPresenter<ModelType> {

        public static fieldFactoryInputText(inputSelector: string, validationErrorSelector?: string, inputValidationErrorClass?: string) {
            return function(form: JQuery) {
                var inputElement = TS.IJQuery.jquerySelectFromRoot(form, inputSelector);
                var validationErrorsElement;
                if( validationErrorSelector ) {
                    validationErrorsElement = TS.IJQuery.jquerySelectFromRoot(form, validationErrorSelector);
                } else {
                    validationErrorsElement = null;
                }
                var onChangeHandler: (e: JQueryEventObject) => void;

                return {
                    setValue: function(value: any) {
                        inputElement.val(value);
                    },

                    getValue: function() {
                        return inputElement.val();
                    },

                    setValidationErrors: function(validationErrors: string[]) {

                        if( validationErrors != null && validationErrors.length > 0 ) {
                            if( validationErrorsElement ) {
                                validationErrorsElement.html(validationErrors.join("<br/>"));
                            }
                            if( inputValidationErrorClass && !inputElement.hasClass(inputValidationErrorClass) ) {
                                inputElement.addClass(inputValidationErrorClass)
                            }
                        } else {
                            if( validationErrorsElement ) {
                                validationErrorsElement.html("");
                            }
                            if( inputValidationErrorClass ) {
                                inputElement.removeClass(inputValidationErrorClass)
                            }
                        }
                    },

                    setChangeCallback: function(changeCallback: (field: IFormJQueryPresenterField)=>void) {
                        if( onChangeHandler != null ) {
                            inputElement.off('change', onChangeHandler);
                        }
                        if( changeCallback != null ) {
                            onChangeHandler = () => {
                                changeCallback(<IFormJQueryPresenterField>this);
                            }
                            inputElement.on('change', onChangeHandler);
                        } else {
                            onChangeHandler = null;
                        }
                    }
                }
            }
        }

        public static fieldFactoryInputCheckbox(inputSelector: string) {
            return function(form: JQuery) {
                var inputElement = TS.IJQuery.jquerySelectFromRoot(form, inputSelector);
                var onChangeHandler: (e: JQueryEventObject) => void;

                return {
                    setValue: function(value: any) {
                        inputElement.prop("checked", value);
                    },

                    getValue: function() {
                        return inputElement.prop("checked");
                    },

                    setValidationErrors: function(validationErrors: string[]) {
                        // do nothing
                    },

                    setChangeCallback: function(changeCallback: (field: IFormJQueryPresenterField)=>void) {
                        if( onChangeHandler != null ) {
                            inputElement.off('change', onChangeHandler);
                        }
                        if( changeCallback != null ) {
                            onChangeHandler = () => {
                                changeCallback(<IFormJQueryPresenterField>this);
                            }
                            inputElement.on('change', onChangeHandler);
                        } else {
                            onChangeHandler = null;
                        }
                    }
                }
            }
        }

        private _fields: {[_:string]:IFormJQueryPresenterField};
        private _submitCallback: (event: JQueryEventObject) => void;


        constructor(
            viewFactory: IJQueryViewFactory,
            private _fieldFactories: {[_:string]:IFormJQueryPresenterFieldFactory},
            private _submitButtonSelector: string,
            private _formErrorsSelector: string
        ) {
            super(viewFactory);
            this._submitCallback = () => {
                this._submit();
            }
        }

        public _doStart() {

            var e = this.$();

            this._fields = {};
            for( var key in this._fieldFactories ) {

                var fieldFactory = this._fieldFactories[key];
                var field = fieldFactory(e);
                var changeCallback = ((key: string) => {
                    return (field: IFormJQueryPresenterField) => {
                        // set the value on the model
                        var value = field.getValue();
                        this.getModel().setFieldValue(key, value);
                    }
                })(key);
                field.setChangeCallback(changeCallback);
                this._fields[key] = field;
            }

            var submitButton = this.$(this._submitButtonSelector);
            submitButton.on('click', this._submitCallback);

            return super._doStart();
        }

        public _doStop() {
            for( var key in this._fields ) {
                var field = this._fields[key];
                field.setChangeCallback(null);
            }

            return super._doStop();
        }

        public _handleModelChangeEvent(event: TS.MVP.ModelChangeEvent) {
            var description = <TS.MVP.Form.FormFieldModelChangeDescription>event.lookupExclusive(TS.MVP.Form.FormFieldModelChangeDescription.FORM_FIELD_MODEL_CHANGE);
            if( description ) {
                var model = this.getModel();
                for( var i in description.fieldValueChangeKeys ) {
                    var key = description.fieldValueChangeKeys[i];
                    var field = this._fields[key];
                    var value = model.getFieldValue(key);
                    field.setValue(value);
                }
                for( var i in description.fieldValidationChangeKeys ) {
                    var key = description.fieldValidationChangeKeys[i];
                    var field = this._fields[key];
                    var validationErrors = model.getFieldValidationErrors(key);
                    field.setValidationErrors(validationErrors);
                }
                this.layout();
            } else {
                super._handleModelChangeEvent(event);
            }
        }

        public _doLoad(model: TS.MVP.Form.IFormModel) {
            // load it up
            for( var key in this._fields ) {
                var field = this._fields[key];
                var value = model.getFieldValue(key);
                var validationErrors = model.getFieldValidationErrors(key);
                field.setValue(value);
                field.setValidationErrors(validationErrors);
            }
            var formErrors = model.getFormErrors();
            var formErrorsElement = this.$(this._formErrorsSelector);
            if( formErrors != null && formErrors.length > 0 ) {
                formErrorsElement.html(formErrors.join("<br/>"));
            } else {
                formErrorsElement.html("");
            }
            this.layout();
        }

        public _submit() {
            // ensure that the value of all the fields has been set on the model
            var model = this.getModel();
            for( var key in this._fields ) {
                var field = this._fields[key];
                var value = field.getValue();
                model.setFieldValue(key, value);
            }
            model.requestSubmit();
        }

    }
}