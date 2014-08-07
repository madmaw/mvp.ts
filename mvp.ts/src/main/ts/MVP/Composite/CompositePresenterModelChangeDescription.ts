module TS.MVP.Composite {

    export class CompositePresenterModelChangeDescription extends ModelChangeDescription {

        public static COMPOSITE_PRESENTER_MODEL_CHANGED = "CompositePresenterModelChanged";

        constructor(public addedPresenters: IPresenter[], public removedPresenters: IPresenter[]) {
            super(CompositePresenterModelChangeDescription.COMPOSITE_PRESENTER_MODEL_CHANGED);
        }
    }

}