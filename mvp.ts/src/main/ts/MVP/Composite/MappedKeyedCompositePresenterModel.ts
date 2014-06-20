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
                var presenter = this._presenterMap[key];
                if (presenter != null) {
                    result.push(presenter);
                }
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


        public exportState(models?: IModel[]): any {
            models = this._checkModels(models);

            var result = {};
            var presenters = this._getDescribedPresenters();
            for (var i in presenters) {
                var presenter = presenters[i];
                var model = presenter.getModel();

                if (model != null && models.indexOf(model) < 0) {
                    var key = this._getDescribedPresenterKey(presenter);
                    var description = model.exportState(models);
                    if (description != null) {
                        result[key] = description;
                    }
                }
            }
            return result;
        }

        public importState(description: any, importCompletionCallback: IModelImportStateCallback) {
            var result: ModelStateChangeEvent[] = [];
            var count = 0;
            var validModels: { [_: string]: IModel } = {};
            for (var key in description) {
                var presenter = this._getDescribedPresenter(key);
                if (presenter != null) {
                    var model = presenter.getModel();
                    if (model != null) {
                        count++;
                        validModels[key] = model;
                    }
                }
            }
            if (count == 0) {
                // welp, we're done already
                if (importCompletionCallback) {
                    importCompletionCallback([]);
                }
            } else {
                for (var key in validModels) {
                    var model = validModels[key];
                    var modelDescription = description[key];
                    model.importState(modelDescription, function (childResult: ModelStateChangeEvent[]) {
                        if (childResult != null) {
                            arrayPushAll(result, childResult);
                        }
                        count--;
                        if (count == 0) {
                            if (importCompletionCallback) {
                                importCompletionCallback(result);
                            }
                        }
                    });
                }
            }
        }
    }
}