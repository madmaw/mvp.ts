// Module
module TS.JQuery.MVP.Tab {

    // Class
    export class TabBarTabJQueryViewDescription {

        public static tabBarTabJQueryViewDescriptionFactoryFromMap(
            tabBarIdsToViewDescriptions: { [_: string]: JQueryViewDescription; },
            clickableElementSelector: string,
            styleableElementSelector: string
        ): ITabBarTabJQueryViewDescriptionFactory {
            return function(container: JQuery, tabBarId: string): TabBarTabJQueryViewDescription {
                var viewDescription = tabBarIdsToViewDescriptions[tabBarId];
                var result;
                if (viewDescription) {
                    var view = viewDescription.createView(container);
                    result = new TabBarTabJQueryViewDescription(clickableElementSelector, styleableElementSelector, view);
                } else {
                    result = null;
                }
                return result;
            }
        }

        // Constructor
        constructor( private _clickableElementSelector:string, private _styleableElementSelector:string, private _view:IJQueryView) {
        }

        public getClickableElementSelector(): string { 
            return this._clickableElementSelector;
        }

        public getStyleableElementSelector(): string {
            return this._styleableElementSelector;
        }

        public getView(): IJQueryView {
            return this._view;
        }
    }

}
