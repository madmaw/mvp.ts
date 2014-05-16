///<reference path="../ICompositePresenterModel.ts"/>

module TS.MVP.Composite.Stack {

    export var stackPresenterModelEventTypePushed = "pushed";
    export var stackPresenterModelEventTypePopped = "popped";

    export interface IStackPresenterModel extends ICompositePresenterModel {
        isStackEmpty():boolean;

        canPop():boolean;

        requestPop():void;
    }
}