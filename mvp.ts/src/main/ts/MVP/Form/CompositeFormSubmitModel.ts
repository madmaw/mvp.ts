module TS.MVP.Form {
    export class CompositeFormSubmitModel extends TS.MVP.Composite.AbstractCompositePresenterModel implements IFormSubmitModel {

        constructor(
            private _formPresenter: IPresenterWithModel<IFormModel>,
            private _submitCallback: (value: any) => void
        ) {
            super();
        }

        public getPresenters(): IPresenter[]{
            return [this._formPresenter];
        }

        requestSubmit() {
            var value = this._formPresenter.getModel().getValue();
            this._submitCallback(value);
        }

        exportState() {
            return this._formPresenter.getModel().exportState();
        }


    }
}