module TS.MVP.List {

    export class AbstractListPresenterModel extends TS.MVP.Composite.AbstractCompositePresenterModel implements IListPresenterModel {

        public _presenters: TS.MVP.IPresenter[];

        public setPresenters(presenters: TS.MVP.IPresenter[], suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            this._presenters = presenters;
            this._updateListeningForStateDescriptionChanges();
            if( !suppressModelChangeEvent ) {
                this._fireModelChangeEvent(null, suppressStateChangeEvent);
            }
        }

        public getPresenters() {
            return this._presenters;
        }


        public getPresenter(index: number, reusePresenter: IPresenter): IPresenter {
            return this._presenters[index];
        }

        getPresenterType(index: number): string {
            return null;
        }

        getPresenterCount(): number {
            return this._presenters.length;
        }


    }

}