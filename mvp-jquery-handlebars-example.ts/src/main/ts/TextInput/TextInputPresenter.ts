module TS.IJQuery.MVP.HB.Example.TextInput {

    // Class
    export class TextInputPresenter extends TS.IJQuery.MVP.AbstractJQueryPresenter<ITextInputModel> {
        // Constructor
        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            private _inputElementSelector: string = ".text_input_presenter_input",
            private _buttonElementSelector: string = ".text_input_presenter_button"
        ) {
            super(viewFactory);
        }

        public _getViewFactoryParams(): any {
            return {
                inputElementSelector: this._inputElementSelector,
                buttonElementSelector: this._buttonElementSelector
            };
        }

        public _doStart(): boolean {
            // listen upon the button for click events
            this.$(this._buttonElementSelector).click(() => {
                this._requestSubmit();
            });
            this.$(this._inputElementSelector).keypress((e:KeyboardEvent) => {
                if (e.which == 13) {
                    this._requestSubmit();
                    e.preventDefault();
                }
            });
            return true;
        }

        private _requestSubmit() {
            var value: string = this.getValue();
            var textInputModel = this._model;
            textInputModel.requestSubmit(value);
        }

        public getValue():string {
            return this.$(this._inputElementSelector).val();
        }

        public _doLoad(model: ITextInputModel) {
            var inputModel = model;
            var value = inputModel.getValue();
            this.$(this._inputElementSelector).val(value);
        }

    }

}
