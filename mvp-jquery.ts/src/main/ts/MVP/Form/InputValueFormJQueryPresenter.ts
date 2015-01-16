module TS.IJQuery.MVP.Form {

    export class InputValueFormJQueryPresenter extends AbstractFormJQueryPresenter<TS.MVP.Form.IFormModel<string, any>> {

        public static EVENT_NAMES = "input propertychange change paste";

        private _onChangeCallback: (event: JQueryEventObject) => void;
        private _onEnterCallback: (event: JQueryEventObject)=> void;

        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            errorSelector?: string,
            errorFormatter?: IErrorFormatter,
            errorClass?: string,
            private _inputSelector?: string
        ) {
            super(viewFactory, errorSelector, errorFormatter, errorClass);

            this._onChangeCallback = () => {
                var input = this.$(this._inputSelector);
                var value = input.val();
                this.getModel().setValue(value, false);
            };
            this._onEnterCallback = (e: JQueryEventObject) => {
                if(e.which == 13 ) {
                    this.getModel().requestComplete();
                }
            };
        }

        _handleModelChangeEvent(event: TS.MVP.ModelChangeEvent) {
            if( event.lookupExclusive(TS.MVP.Form.FORM_FIELD_FOCUS_MODEL_CHANGE) ) {
                var input = this.$(this._inputSelector);
                input.focus();
            } else {
                super._handleModelChangeEvent(event);
            }
        }

        _doStart() {
            var input = this.$(this._inputSelector);
            input.on(InputValueFormJQueryPresenter.EVENT_NAMES, this._onChangeCallback);
            input.on("keydown", this._onEnterCallback);
            return super._doStart();
        }

        _doStop() {
            var input = this.$(this._inputSelector);
            input.off(InputValueFormJQueryPresenter.EVENT_NAMES, this._onChangeCallback);
            input.off("keydown", this._onEnterCallback);
            return super._doStop();
        }

        _doLoad(model: TS.MVP.Form.IFormModel<string, any>) {
            super._doLoad(model);
            var input = this.$(this._inputSelector);
            var oldValue = input.val();
            var newValue = model.getValue();
            // don't change if it's the same because that resets the input
            if( oldValue != newValue ) {
                input.val(newValue);
            }
        }

    }

}