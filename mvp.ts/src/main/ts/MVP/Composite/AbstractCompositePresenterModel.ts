// Module
module TS.MVP.Composite {

    // Class
    export class AbstractCompositePresenterModel extends AbstractModel implements ICompositePresenterModel {

        public _stateChangeListener: IModelStateChangeListener;
        private _presenterChangeListener: IPresenterChangeListener;
        private _previouslyDescribedPresenters: IPresenter[];

        constructor() {
            super();
            this._stateChangeListener = (source: IModel, change: ModelStateChangeEvent, firedModels:IModel[]) => {
                if (source != this) {
                    // models can be shared between controllers so we need to be careful we don't propogate our own events 
                    this._fireStateChangeEvent(source, change, firedModels);
                }
            };
            this._presenterChangeListener = (source: IPresenter, change: PresenterChangeEvent) => {
                if (change.getModelChanged()) {
                    var previousModel = change.getPreviousModel();
                    if (previousModel != null) {
                        previousModel.removeStateChangeListener(this._stateChangeListener);
                    }
                    // listen on the new modle
                    var currentModel = source.getModel();
                    if (currentModel != null) {
                        currentModel.addStateChangeListener(this._stateChangeListener);
                    }
                }
            }
        }

        public _getDescribedPresenters(): IPresenter[] {
            var presenters = this.getPresenters();
            var result = [];
            // TODO should be a better way
            for (var i in presenters) {
                var presenter = presenters[i];
                if (presenter.getModel() != this) {
                    result.push(presenter);
                }
            }
            return result;
        }

        public getPresenters(): IPresenter[]{
            return [];
        }

        public _startedListeningForStateChanges() {
            super._startedListeningForStateChanges();
            this._startListeningForStateDescriptionChanges();
        }

        private _startListeningForStateDescriptionChanges() {
            var presenters = this._getDescribedPresenters();
            this._previouslyDescribedPresenters = [];
            if (presenters != null) {
                // listen on the models for all the controllers
                for (var i in presenters) {
                    var presenter = presenters[i];
                    presenter.addChangeListener(this._presenterChangeListener);
                    this._previouslyDescribedPresenters.push(presenter);
                    var model = presenter.getModel();
                    if (model != null) {
                        model.addStateChangeListener(this._stateChangeListener);
                    }
                }
            }
        }

        public _stoppedListeningForStateChanges() {
            super._stoppedListeningForStateChanges();
            this._stopListeningForStateDescriptionChanges();
            this._previouslyDescribedPresenters = null;
        }

        private _stopListeningForStateDescriptionChanges() {
            var presenters = this._previouslyDescribedPresenters;
            if (presenters != null) {
                for (var i in presenters) {
                    var presenter: IPresenter = presenters[i];
                    presenter.removeChangeListener(this._presenterChangeListener);
                    var model: IModel = presenter.getModel();
                    if (model != null) {
                        model.removeStateChangeListener(this._stateChangeListener);
                    }
                }
            }
        }

        public _updateListeningForStateDescriptionChanges() {
            this._stopListeningForStateDescriptionChanges();
            this._startListeningForStateDescriptionChanges();
        }

        public exportState(models?: IModel[]): any {
            models = this._checkModels(models);
            var presenters = this._getDescribedPresenters();
            var result = [];
            if (presenters != null) {
                for (var i in presenters) {
                    var presenter = presenters[i];
                    var model = presenter.getModel();
                    var entry;
                    if (model != null) {
                        entry = model.exportState(models);
                    } else {
                        entry = null;
                    }
                    result.push(entry);
                }
            }
            return result;
        }

        public importState(description: any, importCompletionCallback: IModelImportStateCallback){
            var presenters = this._getDescribedPresenters();
            var descriptions = <any[]>description;
            var count = descriptions.length;
            var result = [];
            if( count == 0 ) {
                if( importCompletionCallback ) {
                    importCompletionCallback(result);
                }
            } else {
                for (var i in descriptions) {
                    var entry = descriptions[i];
                    var presenter = presenters[i];
                    var model = presenter.getModel();
                    if (model != null) {
                        var modelResult = model.importState(entry, function(changes:ModelStateChangeEvent[]) {
                            // TODO not sure if this is right? (assumes only one "stateful" child)
                            arrayPushAll(result, changes);
                            count--;
                            if( count == 0 ) {
                                if( importCompletionCallback ) {
                                    importCompletionCallback(result);
                                }
                            }
                        });
                    }
                }
            }
        }

    }

}