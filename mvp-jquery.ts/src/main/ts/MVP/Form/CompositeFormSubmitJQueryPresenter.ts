module TS.IJQuery.MVP.Form {
    export class CompositeFormSubmitJQueryPresenter extends TS.IJQuery.MVP.Composite.AbstractCompositeJQueryPresenter<TS.MVP.Form.IFormSubmitModel> {

        private _submitCallback: (event: JQueryEventObject) => void;

        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            private _submitButtonSelector: string) {
            super(viewFactory);
            this._submitCallback = () => {
                this.getModel().requestSubmit();
            };
        }

        _doStart() {
            this.$(this._submitButtonSelector).on('click', this._submitCallback);
            return super._doStart();
        }

        start() {
            var result = super.start();
            // do last
            this.getModel().requestInit();
            return result;
        }

        _doStop() {
            this.$(this._submitButtonSelector).off('click', this._submitCallback);
            return super._doStop();
        }

    }
}