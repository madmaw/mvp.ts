module TS.IJQuery.MVP.Form {
    export class CheckBoxValueFormJQueryPresenter extends AbstractFormJQueryPresenter<TS.MVP.Form.IFormFieldModel<boolean, any>> {

        private _onChangeCallback: (event: JQueryEventObject) => void;

        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            errorSelector: string,
            errorFormatter: IErrorFormatter,
            errorClass: string,
            private _checkBoxSelector: string
            ) {
            super(viewFactory, errorSelector, errorFormatter, errorClass);

            this._onChangeCallback = () => {
                var checkBox = this.$(this._checkBoxSelector);
                var checked = checkBox.prop("checked");
                var value = "true" == ""+checked;
                this.getModel().setValue(value);
            };
        }

        _handleModelChangeEvent(event: TS.MVP.ModelChangeEvent) {
            if( event.lookupExclusive(TS.MVP.Form.FORM_FIELD_FOCUS_MODEL_CHANGE) ) {
                var checkBox = this.$(this._checkBoxSelector);
                checkBox.focus();
            } else {
                super._handleModelChangeEvent(event);
            }
        }

        _doStart() {
            var checkBox = this.$(this._checkBoxSelector);
            checkBox.on("change", this._onChangeCallback);
            return super._doStart();
        }

        _doStop() {
            var checkBox = this.$(this._checkBoxSelector);
            checkBox.off("change", this._onChangeCallback);
            return super._doStop();
        }

        _doLoad(model: TS.MVP.Form.IFormFieldModel<boolean, any>) {
            super._doLoad(model);

            var value = model.getValue();
            var checkBox = this.$(this._checkBoxSelector);
            checkBox.prop("checked", value);
        }
    }
}