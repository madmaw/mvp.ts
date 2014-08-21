
// Module
module TS.MVP.Tab {

    // Class
    /**
     * combined tab bar and composite model for common tab-bar behavior
     */
    export class MappedKeyedCompositePresenterTabBarModel extends TS.MVP.Composite.MappedKeyedCompositePresenterModel implements ITabBarModel {

        public _selectedTabId: string;

        // Constructor
        constructor(selectedTabId: string, private _tabIdsToPresenters: { [_:string]: IPresenter; }, public _tabPresenterKey: string, _presenterMap?: { [_:string]: IPresenter; }) {
            super(_presenterMap);
            this._setSelectedTabId(selectedTabId);
        }

        public getSelectedTabId(): string {
            return this._selectedTabId;
        }

        public getAvailableTabIds(): string[]{
            // TODO sort this (platform dependent otherwise)
            var result = [];
            for (var tabId in this._tabIdsToPresenters) {
                result.push(tabId);
            }
            return result;
        }

        public requestSelectTabId(tabId: string) {
            this._setSelectedTabId(tabId);
        }

        public _setSelectedTabId(tabId: string, suppressModelChangeEvent?:boolean, suppressStateChangeEvent?:boolean) {
            if (this._selectedTabId != tabId) {
                var previouslySelectedTabId = this._selectedTabId;
                this._selectedTabId = tabId;
                var selectedTabPresenter = this._tabIdsToPresenters[tabId];
                this.setPresenter(this._tabPresenterKey, selectedTabPresenter, true);
                if (!suppressModelChangeEvent) {
                    this._fireModelChangeEvent(
                        new ModelChangeEvent(
                            [
                                new ModelChangeDescription(tabBarModelEventTypeSelectedTabChange),
                                new ModelChangeDescription(TS.MVP.Composite.compositePresenterModelEventTypePresentersChanged)
                            ]
                        ),
                        true
                    );
                }
                if( !suppressStateChangeEvent ) {
                    this._fireStateChangeOperation(
                        this,
                        new MappedKeyedCompositePresenterTabBarModelStateChangeOperation(
                            this,
                            previouslySelectedTabId,
                            tabId
                        )
                    )
                }
            }
        }

        public exportState(models?: IModel[]): any {
            var result = super.exportState(models);
            // hack it into existing structure?!
            result["_selectedTabId"] = this._selectedTabId;

            return result;
        }

        public importState(description: any, importCompletionCallback: IModelImportStateCallback) {
            if (description != null) {
                this._setSelectedTabId(description["_selectedTabId"], true);
            }
            // TODO ensure you import the selected tab id last!
            super.importState(description, importCompletionCallback);
        }

        public _getDescribedPresenters(): IPresenter[] {
            var result = super._getDescribedPresenters();
            for (var tabId in this._tabIdsToPresenters) {
                var presenter = this._tabIdsToPresenters[tabId];
                if (presenter != null && result.indexOf(presenter) < 0) {
                    result.push(presenter);
                }
            }
            return result;
        }

        public _getDescribedPresenterKey(presenter: IPresenter): string {
            var result = super._getDescribedPresenterKey(presenter);
            if (result == this._tabPresenterKey || result == null) {
                // need to differentiate
                for (var key in this._tabIdsToPresenters) {
                    var tabPresenter = this._tabIdsToPresenters[key];
                    if (tabPresenter == presenter) {
                        result = key;
                        break;
                    }
                }
            }
            return result;
        }

        public _getDescribedPresenter(key: string): IPresenter {
            var result = super._getDescribedPresenter(key);
            if (result == null) {
                result = this._tabIdsToPresenters[key];
            }
            return result;
        }

    }

}