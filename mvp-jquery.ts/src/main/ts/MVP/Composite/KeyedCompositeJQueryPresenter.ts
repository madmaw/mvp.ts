module TS.IJQuery.MVP.Composite {

    export class KeyedCompositeJQueryPresenter<ModelType extends TS.MVP.Composite.IKeyedCompositePresenterModel> extends AbstractCompositeJQueryPresenter<ModelType> {

        constructor(viewFactory: IJQueryViewFactory, private _keysToSelectors?: { [_:string]: string; }) {
            super(viewFactory);
            if (this._keysToSelectors == null) {
                this._keysToSelectors = {};
            }
        }

        public _getViewFactoryParams(): any {
            // get all the selectors
            var result = {};
            for (var key in this._keysToSelectors) {
                var selector = this._keysToSelectors[key];
                result[key] = selector;
            }
            var model = this.getModel();
            if (model) {
                var presenters = model.getPresenters();
                for (var i in presenters) {
                    var presenter = presenters[i];
                    var presenterKey = model.getPresenterKey(presenter);
                    var selector = this._getPresenterContainerSelector(presenter);
                    result[presenterKey] = selector;
                }
            }
            return result;
        }

        public setKeyAndSelector(key: string, selector: string) {
            this._keysToSelectors[key] = selector;
        }

        public _getPresenterContainerSelector(presenter: TS.MVP.IPresenter): string {
            var model = <TS.MVP.Composite.IKeyedCompositePresenterModel>this._model;
            var key = model.getPresenterKey(presenter);
            var selector = this._keysToSelectors[key];
            if (selector == null && key != null) {
                // assume it's a class selector in lieu of an explicit mapping
                selector = "."+key;
            }
            return selector;
        }

    }

} 