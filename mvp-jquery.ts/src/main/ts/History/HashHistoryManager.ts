// Module
module TS.IJQuery.History {

    // Class
    export class HashHistoryManager {

        private _stateDescriptionChangeListener: TS.MVP.IModelStateChangeListener;
        private _historyChangeListener: EventListener;

        private _model: TS.MVP.IModel;
        private _historyItems: HashHistoryItem[];
        private _historyItemIndex: number;

        // Constructor
        constructor(private _presenter: TS.MVP.IPresenter, private _encoder:(data:any)=>string, private _decoder:(encoded:string)=>any) {
            this._historyItems = [];
            this._model = this._presenter.getModel();

            this._stateDescriptionChangeListener = (model: TS.MVP.IModel, modelStateChange: TS.MVP.ModelStateChangeEvent) => {
                this.push(modelStateChange);
            };

            this._historyChangeListener = (event: PopStateEvent) => {
                // TODO back/forward doesn't work if the back and forward urls are the same!!!
                var state = event.state;
                this._consumeBrowserStateChange(state);
            };

        }

        public _consumeBrowserStateChange(state?: any) {
            var description;
            var dataString = this._dataStringFromLocation(window.location);

            if (state == null && dataString != null) {
                // TOOD parse out the state from the URL required
                description = this._decode(dataString);
            } else {
                description = state;
            }
            var back;
            var change: TS.MVP.IModelStateChangeOperation;

            var historyItemIndex: number;
            if (this._historyItemIndex != null && this._historyItemIndex > 0 && this._historyItems[this._historyItemIndex - 1].getModelStateDataEncoded() == dataString) {
                back = true;
                var historyItem = this._historyItems[this._historyItemIndex];
                change = historyItem.getModelStateChange();
                historyItemIndex = this._historyItemIndex - 1;
            } else if (this._historyItemIndex != null && this._historyItemIndex < this._historyItems.length - 1 && this._historyItems[this._historyItemIndex + 1].getModelStateDataEncoded() == dataString) {
                back = false;
                historyItemIndex = this._historyItemIndex + 1;
                var historyItem = this._historyItems[historyItemIndex];
                change = historyItem.getModelStateChange();
            } else {
                // we've probably backed off the end of the local history into the browser history (the user refreshed), add this value to the start of our history
                historyItemIndex = 0;
                this._historyItems.splice(0, 0, new HashHistoryItem(description, dataString, null, null));
                back = true;
                change = null;
            }
            if (change != null) {
                // try to stop it from scrolling
                if (back) {
                    change.undo();
                    // current change
                    if( historyItemIndex >= 0 ) {
                        var currentChange = this._historyItems[historyItemIndex].getModelStateChange();
                        if( currentChange ) {
                            currentChange.activate();
                        }
                    }
                } else {
                    change.redo();
                }
            } else {
                this._init(description);
            }
            this._historyItemIndex = historyItemIndex;
        }

        public push(modelStateChange: TS.MVP.ModelStateChangeEvent) {
            // TODO : check that the state isn't identical to the back state, if it is, then assume this is actually a back event and adjust the history accordingly
            // always replace the first entry as it will occur on loading the model
            var replace = this._historyItemIndex == null;
            var stateDescription = this._model.exportState();
            var s = this._encode(stateDescription);
            // assume that if the previous is the same, we are actually seeing a back operation!
            if (this._historyItemIndex != null && this._historyItemIndex > 0 && this._historyItems[this._historyItemIndex - 1].getModelStateDataEncoded() == s) {

                var previousHistoryItem = this._historyItems[this._historyItemIndex -1];
                previousHistoryItem.setModelStateChange(modelStateChange.getOperation());
                // TODO pop?
                window.history.back();

            } else if( false && this._historyItemIndex != null && this._historyItemIndex < this._historyItems.length - 1 && this._historyItems[this._historyItemIndex+1].getModelStateDataEncoded() == s ) {

                var nextHistoryItem = this._historyItems[this._historyItemIndex + 1];
                nextHistoryItem.setModelStateChange(modelStateChange.getOperation());
                this._historyItemIndex++;
                // pretty sure we're better off handling this ourselves than trying to convince the browser to behave
                //window.history.forward();
            } else {

                if (this._historyItemIndex == null || s != this._historyItems[this._historyItemIndex].getModelStateDataEncoded()) {
                    if (this._historyItemIndex == null) {
                        this._historyItemIndex = 0;
                    } else {
                        var historyItem = this._historyItems[this._historyItemIndex];
                        if( historyItem.replaceId != null && historyItem.replaceId == modelStateChange.getReplaceId() ) {
                            replace = true;
                        } else {
                            this._historyItemIndex++;
                        }
                    }
                    var url = this._dataStringToPath(s);
                    if( url == null || url.length == 0 ) {
                        // empty paths will not be pushed?
                        url = "/";
                    }
                    if (replace) {
                        // TODO the model is now responsible for the title....
                        window.history.replaceState(stateDescription, null, url);
                    } else {
                        window.history.pushState(stateDescription, null, url);
                    }
                    // TODO maintain state changes alongside the shit (you know what I mean)
                    var historyItem = new HashHistoryItem(stateDescription, s, modelStateChange.getOperation(), modelStateChange.getReplaceId());
                    if (this._historyItems.length <= this._historyItemIndex) {
                        this._historyItems.push(historyItem);
                    } else {
                        this._historyItems[this._historyItemIndex] = historyItem;
                    }
                }
            }
        }

        public _dataStringToPath(dataString:string) {
            var before = window.location.pathname;
            var url = before;
            if( dataString != null ) {
                url += "#" + dataString;
            }
            return url;
        }

        public _dataStringFromLocation(location:Location): string {
            var dataString: string;
            var hash = location.hash;
            if (hash != null && hash.length > 0) {
                if (hash.charAt(0) == '#') {
                    hash = hash.substring(1);
                }
                dataString = hash;
            } else {
                dataString = null;
            }
            return dataString;
        }

        public start(): void {
            this._model.addStateChangeListener(this._stateDescriptionChangeListener);
            window.addEventListener('popstate', this._historyChangeListener);
            // force the current window location onto the stack
        }

        public stop(): void {
            this._model.removeStateChangeListener(this._stateDescriptionChangeListener);
            window.removeEventListener('popstate', this._historyChangeListener);
        }

        public _decode(encoded: string): any {
            var result;
            if (encoded == null) {
                result = null;
            } else {
                result = this._decoder(encoded);
            } 
            return result;
        }

        public _encode(data: any): string {
            return this._encoder(data);
        }

        public init(location: Location, onInitialized?:()=>void): void {

            var dataString = this._dataStringFromLocation(window.location);
            var data = this._decode(dataString);
            this._init(data, (changes: TS.MVP.ModelStateChangeEvent[]) => {
                // pre-populating history may not be a good idea anyway
                /*
                if (populateHistory) {
                    this._historyItems = [];
                    for (var i in changes) {
                        var change = changes[i];
                        
                        var historyItem = new HashHistoryItem(null, null, change.getOperation());
                        this._historyItems.push(historyItem);
                        //window.history.pushState();
                    }
                    var historyItemIndex = this._historyItems.length - 1;
                    if (historyItemIndex >= 0) {
                        this._historyItemIndex = historyItemIndex;
                    } else {
                        this._historyItemIndex = null;
                    }
                }
                */
                if( this._historyItemIndex == null ) {
                    this._historyItems.push(new HashHistoryItem(data, dataString, null, null));
                    this._historyItemIndex = 0;
                }

                if (onInitialized) {
                    onInitialized();
                }
            });
        }

        private _init(description: any, onInitialized?: TS.MVP.IModelImportStateCallback): void {
            var started = this._presenter.getState() == TS.MVP.PresenterState.Started;
            if (started) {
                //this._presenter.stop();
            }
            this._model.importState(description, onInitialized);
            if (started) {
                //this._presenter.start();
            }
        }
    }

}