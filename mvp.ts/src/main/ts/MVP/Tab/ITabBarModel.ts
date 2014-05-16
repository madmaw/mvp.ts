///<reference path="../IModel.ts"/>

// Module
module TS.MVP.Tab {
    
    export var tabBarModelEventTypeSelectedTabChange = "selectedTabId";
    export var tabBarModelEventTypeAvailableTabChange = "availableTabIds";

    // Class
    export interface ITabBarModel extends IModel {
        getSelectedTabId(): string;

        getAvailableTabIds(): string[];

        requestSelectTabId(tabId: string);
    }
}