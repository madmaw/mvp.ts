///<reference path="AbstractCompositePresenterModel.ts"/>
///<reference path="IKeyedCompositePresenterModel.ts"/>

// Module
module TS.MVP.Composite {

    // Class
    /**
     * basic implementation of a generic mapped controller
     */
    export class MappedKeyedCompositePresenterModel extends AbstractCompositePresenterModel implements IKeyedCompositePresenterModel {

        // TODO remove this alternate constructor once compiler gets fixed
        constructor(public _presenterMap?: { [_:string]: IPresenter; }) {
            super();
            this._listeningForTokenChanges = false;
            if (this._presenterMap == null) {
                this._presenterMap = {};
            }
        }

        public getPresenterKey(presenter:IPresenter): string {
            var result: string = null;
            for (var key in this._presenterMap) {
                var found = this._presenterMap[key];
                if (found == presenter) {
                    result = key;
                    break;
                }
            }
            return result;
        }

        public getPresenters(): IPresenter[]{
            var result = [];
            for (var key in this._presenterMap) {
                var controller = this._presenterMap[key];
                result.push(controller);
            }
            return result;
        }

        public setPresenter(key: string, presenter: IPresenter, doNotFireEvent?: boolean) {
            if (this._listeningForTokenChanges) {
                var oldPresenter: IPresenter = this._presenterMap[key];
                if (oldPresenter != null) {
                    var oldModel = oldPresenter.getModel();
                    if (oldModel != null) {
                        oldModel.removeStateChangeListener(this._stateChangeListener);
                    }
                }
            }
            this._presenterMap[key] = presenter;
            if (presenter != null) {
                var model = presenter.getModel();
                if (model != null) {
                    model.addStateChangeListener(this._stateChangeListener);
                }
            }
            if (doNotFireEvent != true) {
                this._fireModelChangeEvent(compositePresenterModelEventTypePresentersChanged);
            }
        }

        public _getDescribedPresenterKey(presenter: IPresenter): string {
            return this.getPresenterKey(presenter);
        }

        public _getDescribedPresenter(key: string): IPresenter {
            return this._presenterMap[key];
        }


        public createStateDescription(models?: IModel[]): any {
            models = this._checkModels(models);

            var result = {};
            var presenters = this._getDescribedPresenters();
            for (var i in presenters) {
                var presenter = presenters[i];
                var model = presenter.getModel();

                if (model != null && models.indexOf(model) < 0) {
                    var key = this._getDescribedPresenterKey(presenter);
                    var description = model.createStateDescription(models);
                    if (description != null) {
                        result[key] = description;
                    }
                }
            }
            return result;
        }

        public loadStateDescription(description: any) {
            var result = {};
            for (var key in description) {
                var presenter = this._getDescribedPresenter(key);
                if (presenter != null) {
                    var model = presenter.getModel();
                    if (model != null) {
                        var modelDescription = description[key];
                        model.loadStateDescription(modelDescription);
                    }
                }
            }
        }
    }
}