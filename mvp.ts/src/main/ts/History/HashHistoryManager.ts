// Module
module TS.MVP.History {

    // Class
    export class HashHistoryManager {

        private _stateDescriptionChangeListener: IModelStateChangeListener;
        private _historyChangeListener: EventListener;

        private _model: IModel;
        private _historyItems: HashHistoryItem[];
        private _historyItemIndex: number;
        

        // Constructor
        constructor(private _presenter: TS.MVP.IPresenter, private _encoder:(data:any)=>string, private _decoder:(encoded:string)=>any) {
            this._historyItems = [];
            // TODO listen for changes to the model
            this._model = this._presenter.getModel();

            this._stateDescriptionChangeListener = (model: IModel, modelStateChange: ModelStateChangeEvent) => {
                this.push(modelStateChange);
            };

            this._historyChangeListener = (event: PopStateEvent) => {
                // TODO back/forward doesn't work if the back and forward urls are the same!!!
                var state = event.state;
                var description;
                var sequenceNumber;
                var dataString;
                var hash = window.location.hash;

                if (hash != null && hash.length > 0) {
                    if (hash.charAt(0) == '#') {
                        hash = hash.substring(1);
                    }
                    dataString = hash;
                } else {
                    dataString = null;
                }

                if (state == null && dataString != null) {
                    // TOOD parse out the state from the URL required
                    description = this._decode(dataString);
                } else {
                    description = state;
                }
                var back;
                var change: IModelStateChangeOperation;
                var historyItemIndex: number;
                if (this._historyItemIndex != null && this._historyItemIndex > 0 && this._historyItems[this._historyItemIndex - 1].getModelStateDataEncoded() == dataString) {
                    back = true;
                    change = this._historyItems[this._historyItemIndex].getModelStateChange();
                    historyItemIndex = this._historyItemIndex - 1;
                } else if (this._historyItemIndex != null && this._historyItemIndex < this._historyItems.length - 1 && this._historyItems[this._historyItemIndex + 1].getModelStateDataEncoded() == dataString) {
                    back = false;
                    historyItemIndex = this._historyItemIndex + 1;
                    change = this._historyItems[historyItemIndex].getModelStateChange();
                } else {
                    // we've probably backed off the end of the local history into the browser history (the user refreshed), add this value to the start of our history
                    historyItemIndex = 0;
                    this._historyItems.splice(0, 0, new TS.MVP.History.HashHistoryItem(description, dataString, null));
                    back = true;
                    change = null;
                }
                if (change != null) {
                    if (back) {
                        change.undo();
                    } else {
                        change.redo();
                    }
                } else {
                    this._init(description);
                }
                this._historyItemIndex = historyItemIndex;
            };

        }

        public push(modelStateChange: ModelStateChangeEvent) {
            // TODO : check that the state isn't identical to the back state, if it is, then assume this is actually a back event and adjust the history accordingly
            // always replace the first entry as it will occur on loading the model
            var replace = this._historyItemIndex == null;
            var stateDescription = this._model.exportState();
            var s = this._encode(stateDescription);
            // assume that if the previous is the same, we are actually seeing a back operation!
            if (this._historyItemIndex != null && this._historyItemIndex > 0 && this._historyItems[this._historyItemIndex - 1].getModelStateDataEncoded() == s) {

                // TODO pop?
                window.history.back();

            } else {

                var before = window.location.protocol + "//" + window.location.host + window.location.pathname;
                if (this._historyItemIndex == null || s != this._historyItems[this._historyItemIndex].getModelStateDataEncoded()) {
                    if (this._historyItemIndex == null) {
                        this._historyItemIndex = 0;
                    } else {
                        this._historyItemIndex++;
                    }
                    var url = before + "#" + s;
                    if (replace) {
                        // TODO the model is now responsible for the title....
                        window.history.replaceState(stateDescription, null, url);
                    } else {
                        window.history.pushState(stateDescription, null, url);
                    }
                    // TODO maintain state changes alongside the shit (you know what I mean)
                    var historyItem = new HashHistoryItem(stateDescription, s, modelStateChange.getOperation());
                    if (this._historyItems.length <= this._historyItemIndex) {
                        this._historyItems.push(historyItem);
                    } else {
                        this._historyItems[this._historyItemIndex] = historyItem;
                    }
                }
            }
        }

        public start(): void {
            // force a hash on the URL
            this._model.addStateChangeListener(this._stateDescriptionChangeListener);
            window.addEventListener('popstate', this._historyChangeListener);
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
            // TODO 
            var hash = location.hash;
            var dataString: string;
            if (hash != null && hash.length > 0) {
                if (hash.charAt(0) == '#') {
                    hash = hash.substring(1);
                }
                dataString = hash;
            } else {
                dataString = null;
            }
            var data = this._decode(dataString);
            this._init(data, (changes: ModelStateChangeEvent[]) => {
                /*
                this._historyItems = [];
                for (var i in changes) {
                    var change = changes[i];
                    // issue here is data isn't actually currently valid
                    var data = change.getDescription();
                    var s = this._encode(data);
                    var historyItem = new HashHistoryItem(data, s, change.getOperation());
                    this._historyItems.push(historyItem);
                }
                var historyItemIndex = this._historyItems.length - 1;
                if (historyItemIndex >= 0) {
                    this._historyItemIndex = historyItemIndex;
                } else {
                    this._historyItemIndex = null;
                }
                */
                if (onInitialized) {
                    onInitialized();
                }
            });
        }

        private _init(description: any, onInitialized?: TS.MVP.IModelImportStateCallback): void {
            var started = this._presenter.getState() == PresenterState.Started;
            if (started) {
                this._presenter.stop();
            }
            this._model.importState(description, onInitialized);
            if (started) {
                this._presenter.start();
            }
        }
    }

}