// Module
module TS.MVP.Composite.Stack {

    // Class
    export class AbstractDescriptiveStackPresenterModel<PresenterType extends IPresenter> extends AbstractStackPresenterModel<PresenterType> {

        private _presenterFactories: { [_: string]: (data: any, callback:IModelImportStateCallback) => PresenterType; };

        // Constructor
        constructor(allowEmptyStack?:boolean, presentersToDisplay?:number) {
            super(allowEmptyStack, presentersToDisplay);
            this._presenterFactories = {};
        }

        public setControllerFactory(key: string, factory: (data: any) => PresenterType) {
            this._presenterFactories[key] = factory;
        }

        public _exportEntry(entry: AbstractStackPresenterModelEntry<PresenterType>, models?: IModel[]): any {
            var controllerFactoryKey = entry.data;
            var modelData = entry.presenter.getModel().exportState(models);
            return {
                controllerFactoryKey: controllerFactoryKey,
                modelData: modelData
            };
        }

        public _importEntry(description: any, callback:IModelImportStateCallback): AbstractStackPresenterModelEntry<PresenterType> {
            var presenterFactoryKey = description["presenterFactoryKey"];
            var modelData = description["modelData"];
            var presenterFactory = this._presenterFactories[presenterFactoryKey];
            var result: AbstractStackPresenterModelEntry<PresenterType>;
            if (presenterFactoryKey != null) {
                var presenter = presenterFactory(modelData, callback);
                result = new AbstractStackPresenterModelEntry(presenter, presenterFactoryKey);
            } else {
                result = null;
            }

            return result;
        }
    }

}