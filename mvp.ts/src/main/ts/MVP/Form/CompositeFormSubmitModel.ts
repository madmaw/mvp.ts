module TS.MVP.Form {
    export class CompositeFormSubmitModel<ValueType> extends TS.MVP.Composite.AbstractCompositePresenterModel implements IFormSubmitModel {

        constructor(
            public _formPresenter: IPresenterWithModel<IFormModel<ValueType>>,
            private _submitCallback: (value: ValueType) => void
        ) {
            super();
        }

        public getPresenters(): IPresenter[]{
            return [this._formPresenter];
        }

        requestSubmit(value:ValueType = this._formPresenter.getModel().getValue()) {
            this._submitCallback(value);
        }

        exportState() {
            return this._formPresenter.getModel().exportState();
        }


    }
}