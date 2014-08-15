
// Module
module TS.IJQuery.MVP {

    
    export class AbstractJQueryPresenter<ModelType extends TS.MVP.IModel> extends TS.MVP.AbstractPresenter<ModelType> implements IJQueryPresenter {

        public _view: IJQueryView;
        public _viewContainer: JQuery;
        private _viewPrepend: boolean;


        constructor(public _viewFactory: IJQueryViewFactory) {
            super();
            if (this._viewFactory == null) {
                throw "view factory required";
            }
        }

        public getView(): TS.MVP.IView {
            return this._view;
        }

        public $(selector?: string): JQuery {
            return jquerySelectFromRoot(this._view.$, selector);
        }

        public init(container: JQuery, prepend?: boolean): boolean {
            var initialized = this._preInit();
            if( initialized ) {
                this._viewContainer = container;
                this._viewPrepend = prepend;
                var viewFactoryParams = this._getViewFactoryParams();
                if (!this._viewFactory) {
                    throw "no view factory!";
                }
                this._view = this._viewFactory(container, viewFactoryParams, prepend);
                this._view.attach();
                this._postInit();
            }
            return initialized;
        }

        public _getViewFactoryParams(): any {
            return null;
        }

        public _reinitialize() {
            this.init(this._viewContainer, this._viewPrepend);
        }

        public load() {
            super.load();
            this.layout();
        }

        public _doDestroy(detachView:boolean): boolean {
            if (detachView) {
                this._view.detach();
            }
            this._view = null;
            return true;
        }
    }
}