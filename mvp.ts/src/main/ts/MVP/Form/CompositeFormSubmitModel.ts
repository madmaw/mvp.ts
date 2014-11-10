module TS.MVP.Form {
    export class CompositeFormSubmitModel<ValueType> extends TS.MVP.Composite.AbstractCompositePresenterModel implements IFormSubmitModel {

        constructor(
            public _formPresenter: IPresenterWithModel<IFormModel<ValueType, any>>,
            private _submitCallback: (value: ValueType) => void
        ) {
            super();
            this._formPresenter.getModel().setCompletionListener(()=> {
                this.requestSubmit();
            });
        }

        requestInit() {
            this._formPresenter.getModel().requestFocus();
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