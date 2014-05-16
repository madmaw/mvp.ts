
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

        public _fireModelChangeEvent(changeDescription?: string, suppressFireStateTokenChange?:boolean);
        public _fireModelChangeEvent(changeDescription?: ModelChangeDescription, suppressFireStateTokenChange?: boolean);
        public _fireModelChangeEvent(changeEvent?: ModelChangeEvent, suppressFireStateTokenChange?: boolean);
        public _fireModelChangeEvent(changeEvent?: any, suppressFireStateTokenChange?: boolean) {
            if (changeEvent == null) {
                changeEvent = new ModelChangeEvent();
            } else if (!(changeEvent instanceof ModelChangeEvent)) {
                changeEvent = new ModelChangeEvent(changeEvent);
            }
            for (var i = this._changeListeners.length; i > 0;) {
                i--;
                var modelOnChangeListener = this._changeListeners[i];
                modelOnChangeListener(this, changeEvent);
            }
            if (suppressFireStateTokenChange != true) {
                // fire state token change event
                this._fireStateChangeEvent(this);
            }
        }

        public addStateChangeListener(listener: (source: IModel, change: IModelStateChange) => void ) {
            this._stateChangeListeners.push(listener);
            if (this._stateChangeListeners.length == 1) {
                this._startedListeningForStateChanges();
            }
        }

        public removeStateChangeListener(listener: (source: IModel, change: IModelStateChange) => void ) {
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

        public _fireStateChangeEvent(source: IModel, change?: IModelStateChange) {
            var fired = [];
            for (var i in this._stateChangeListeners) {
                var stateTokenChangeListener = this._stateChangeListeners[i];
                if (fired.indexOf(stateTokenChangeListener) < 0) {
                    stateTokenChangeListener(source, change);
                    // can end up with legitimate duplicates, don't want to fire them multiple times though
                    fired.push(stateTokenChangeListener);
                }
            }
        }


        public createStateDescription(models?: IModel[]): any {
            this._checkModels(models);
            return null;
        }

        public loadStateDescription(description: any) {
            // ignore
        }

        public _checkModels(models: IModel[]) {
            if (models == null) {
                models = [this];
            } else {
                if (models.indexOf(this) >= 0) {
                    throw ("this model "+this+" has already been added");
                } else {
                    models.push(this);
                }
            }
            return models;
        }
    }
}