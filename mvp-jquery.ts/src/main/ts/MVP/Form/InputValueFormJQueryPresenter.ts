module TS.IJQuery.MVP.Form {

    export class InputValueFormJQueryPresenter extends AbstractFormJQueryPresenter<TS.MVP.Form.IFormModel<string>> {

        public static EVENT_NAMES = "input propertychange change paste";

        private _onChangeCallback: (event: JQueryEventObject) => void;

        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            errorSelector: string,
            errorFormatter: IErrorFormatter,
            errorClass: string,
            private _inputSelector: string
        ) {
            super(viewFactory, errorSelector, errorFormatter, errorClass);

            this._onChangeCallback = () => {
                var input = this.$(this._inputSelector);
                var value = input.val();
                this.getModel().setValue(value, false);
            };
        }

        _doStart() {
            var input = this.$(this._inputSelector);
            input.on(InputValueFormJQueryPresenter.EVENT_NAMES, this._onChangeCallback);
            return super._doStart();
        }

        _doStop() {
            var input = this.$(this._inputSelector);
            input.off(InputValueFormJQueryPresenter.EVENT_NAMES, this._onChangeCallback);
            return super._doStop();
        }

        _doLoad(model: TS.MVP.Form.IFormModel<string>) {
            super._doLoad(model);

            this.$(this._inputSelector).val(model.getValue());
        }

    }

}