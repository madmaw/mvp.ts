module TS.MVP.Form {

    export interface IFormSubmitModel extends TS.MVP.Composite.ICompositePresenterModel {

        requestInit();

        requestSubmit();
    }

}