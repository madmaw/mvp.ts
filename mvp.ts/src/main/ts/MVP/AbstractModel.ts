
module TS.MVP {

    export class AbstractModel implements IModel {

        private _changeListeners: IModelChangeListener[];
        private _stateChangeListeners: IModelStateChangeListener[];
        public _listeningForTokenChanges: boolean;
        public _isListening: boolean;

        constructor() {
            this._changeListeners = [];
            this._stateChangeListeners = [];
            this._isListening = false;
        }

        public addChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void ) {
            if (this._changeListeners.length == 0) {
                // do this first as we don't want to fire events to all the just added listeners as they're (probably) about to do a load anyway
                this._isListening = true;
                this._startedListening();
            }
            if( TS.arrayContains(this._changeListeners, listener) ) {
                throw "already exists!";
            }
            this._changeListeners.push(listener);
        }

        public removeChangeListener(listener: (source: IModel, changeEvent: ModelChangeEvent) => void ) {
            var removed = arrayRemoveElement(this._changeListeners, listener);
            if (removed && this._changeListeners.length == 0) {
                this._isListening = false;
                this._stoppedListening();
            }
        }

        public _startedListening() {
        }

        public _stoppedListening() {
        }

        public _fireModelChangeEvent(changeDescription?: string, suppressFireStateTokenChange?:boolean, firedModels?:IModel[]);
        public _fireModelChangeEvent(changeDescription?: ModelChangeDescription, suppressFireStateTokenChange?: boolean, firedModels?:IModel[]);
        public _fireModelChangeEvent(changeEvent?: ModelChangeEvent, suppressFireStateTokenChange?: boolean, firedModels?:IModel[]);
        public _fireModelChangeEvent(changeEvent?: any, suppressFireStateTokenChange?: boolean, firedModels?:IModel[]) {
            if (changeEvent == null) {
                changeEvent = new ModelChangeEvent();
            } else if (!(changeEvent instanceof ModelChangeEvent)) {
                changeEvent = new ModelChangeEvent(changeEvent);
            }
            if( firedModels == null || firedModels.indexOf(this) < 0 ) {
                var newFiredModels = this._checkModels(firedModels);
                for (var i = this._changeListeners.length; i > 0;) {
                    i--;
                    var modelOnChangeListener = this._changeListeners[i];
                    modelOnChangeListener(this, changeEvent, newFiredModels);
                }
                if (suppressFireStateTokenChange != true) {
                    // fire state token change event
                    this._fireStateChangeOperation(this, null, firedModels);
                }
            }
        }

        public addStateChangeListener(listener: IModelStateChangeListener ) {
            this._stateChangeListeners.push(listener);
            if (this._stateChangeListeners.length == 1) {
                this._startedListeningForStateChanges();
            }
        }

        public removeStateChangeListener(listener: IModelStateChangeListener ) {
            if (arrayRemoveElement(this._stateChangeListeners, listener)) {
                if (this._stateChangeListeners.length == 0) {
                    this._stoppedListeningForStateChanges();
                }
            }
        }

        public _startedListeningForStateChanges() {
             
        }

        public _stoppedListeningForStateChanges() {
        }

        public _fireStateChangeOperation(source: IModel, operation?: IModelStateChangeOperation, firedModels?:IModel[]) {
            var event = new ModelStateChangeEvent(operation);
            this._fireStateChangeEvent(source, event, firedModels);
        } 

        public _fireStateChangeEvent(source: IModel, event: ModelStateChangeEvent, firedModels?:IModel[]) {
            var fired = [];
            if( firedModels == null || firedModels.indexOf(this) < 0 ) {
                firedModels = this._checkModels(firedModels);
                for (var i in this._stateChangeListeners) {
                    var stateTokenChangeListener = this._stateChangeListeners[i];
                    if (fired.indexOf(stateTokenChangeListener) < 0) {
                        // can end up with legitimate duplicates, don't want to fire them multiple times though
                        fired.push(stateTokenChangeListener);
                        stateTokenChangeListener(source, event, firedModels);
                    }
                }
            }
        }


        public exportState(models?: IModel[]): any {
            this._checkModels(models);
            return null;
        }

        public importState(description: any, importCompletionCallback: IModelImportStateCallback): void {
            var changes = this._importState(description);
            if (importCompletionCallback != null) {
                importCompletionCallback(changes);
            }
        }

        public _importState(description: any): ModelStateChangeEvent[]{
            return null;
        }

        public _checkModels(models: IModel[]) {
            if (models == null) {
                models = [this];
            } else {
                if (models.indexOf(this) >= 0) {
                    throw ("this model "+this+" has already been added");
                } else {
                    //models.push(this); -- create a copy, it's safer
                    var result = arrayCopy(models);
                    result.push(this);
                    models = result;
                }
            }
            return models;
        }

        public _proxyChanges(model: IModel): ()=>void {
            var changeListener = (source: IModel, changeEvent: ModelChangeEvent, firedModels: IModel[])=> {
                this._notifyProxyChanged(source, changeEvent, firedModels);
            };
            model.addChangeListener(changeListener)
            return function() {
                model.removeChangeListener(changeListener);
            }
        }

        public _notifyProxyChanged(proxy: IModel, changeEvent: ModelChangeEvent, firedModels?:IModel[]) {
            this._fireModelChangeEvent(changeEvent, true, firedModels);
        }
    }
}