// Module
module TS.IJQuery.MVP.Tab {

    // Class 
    export class TabBarJQueryPresenter<ModelType extends TS.MVP.Tab.ITabBarModel> extends AbstractJQueryPresenter<ModelType> {

        private _tabIdsToDescriptions: { [_:string]: TabBarTabJQueryViewDescription; };

        // Constructor
        constructor(viewFactory: IJQueryViewFactory, private _tabBarTabViewDescriptionFactory: ITabBarTabJQueryViewDescriptionFactory, private _tabButtonContainerSelector:string, private _selectedTabClass:string) {
            super(viewFactory);
            this._tabIdsToDescriptions = {};
        }

        public _doLoad(model: TS.MVP.Tab.ITabBarModel) {

            // unload existing views
            this._removeAllTabs();

            var tabBarModel = model;

            var tabIds = tabBarModel.getAvailableTabIds();
            var selectedTabId = tabBarModel.getSelectedTabId();
            var tabButtonContainer = this.$(this._tabButtonContainerSelector);
            for (var i in tabIds) {
                var tabId = tabIds[i];
                var description: TabBarTabJQueryViewDescription = this._tabBarTabViewDescriptionFactory(tabButtonContainer, tabId);
                if( description ) {
                    // null descriptions are allowed for virtual tabs
                    var view = description.getView();
                    view.attach();

                    if (tabId == selectedTabId) {
                        // add the class
                        var styleableElements = jquerySelectFromRoot(view.$, description.getStyleableElementSelector());
                        styleableElements.addClass(this._selectedTabClass);
                    }
                    // add in the onclick listener
                    var clickableElements = jquerySelectFromRoot(view.$, description.getClickableElementSelector());
                    clickableElements.click(tabId, (e:JQueryEventObject) => {
                        this._requestSelectTabId(e.data);
                    });
                    this._tabIdsToDescriptions[tabId] = description;
                }
            }
        }

        private _removeAllTabs(): void {
            for (var tabId in this._tabIdsToDescriptions) {
                var description: TabBarTabJQueryViewDescription = this._tabIdsToDescriptions[tabId];
                description.getView().detach();
            }
            this._tabIdsToDescriptions = {};
        }

        private _requestSelectTabId(tabId: string) {
            var tabBarModel = this._model;
            tabBarModel.requestSelectTabId(tabId);
        }

        private _selectTab(selectedTabId: string) {
            // deselect any other selected tabs
            for (var tabId in this._tabIdsToDescriptions) {
                var description = this._tabIdsToDescriptions[tabId];
                var view = description.getView();
                var styleableElements = jquerySelectFromRoot(view.$, description.getStyleableElementSelector());
                if (tabId == selectedTabId) {
                    // add the class
                    styleableElements.addClass(this._selectedTabClass);
                } else {
                    // remove the class
                    styleableElements.removeClass(this._selectedTabClass);
                }
            }

        }

        public _handleModelChangeEvent(event: TS.MVP.ModelChangeEvent) {
            if (event.lookup(TS.MVP.Tab.tabBarModelEventTypeSelectedTabChange)) {
                // special case for the selected tab changing (avoids reloading everything)
                var tabBarModel = this._model;
                this._selectTab(tabBarModel.getSelectedTabId());
            } else {
                super._handleModelChangeEvent(event);
            }
        }
    }

}
