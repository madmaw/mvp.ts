// Module
module TS.MVP.Composite.Stack {

    // Class
    export class AbstractDescriptiveStackPresenterModel extends AbstractStackPresenterModel {

        private _presenterFactories: { [_:string]: (data: any) => IPresenter; };

        // Constructor
        constructor(allowEmptyStack?:boolean, presentersToDisplay?:number) {
            super(allowEmptyStack, presentersToDisplay);
            this._presenterFactories = {};
        }

        public setControllerFactory(key: string, factory:(data: any) => IPresenter) {
            this._presenterFactories[key] = factory;
        }

        public _entryToDescription(entry: AbstractStackPresenterModelEntry, models?: IModel[]): any {
            var controllerFactoryKey = entry.data;
            var modelData = entry.presenter.getModel().createStateDescription(models);
            return {
                controllerFactoryKey: controllerFactoryKey,
                modelData: modelData
            };
        }

        public _createEntryFromDescription(description: any): AbstractStackPresenterModelEntry {
            var presenterFactoryKey = description["presenterFactoryKey"];
            var modelData = description["modelData"];
            var presenterFactory = this._presenterFactories[presenterFactoryKey];
            var result: AbstractStackPresenterModelEntry;
            if (presenterFactoryKey != null) {
                var presenter = presenterFactory(modelData);
                result = new AbstractStackPresenterModelEntry(presenter, presenterFactoryKey);
            } else {
                result = null;
            }
            return result;
        }
    }

}