module TS.JQuery.MVP.Stateful {

    export class TemplatingStatefulJQueryPresenter<T> extends AbstractJQueryPresenter<TS.MVP.Stateful.IStatefulModel<T>> {

        constructor(viewFactory: IJQueryViewFactory) {
            super(viewFactory);
        }

        public _getViewFactoryParams(): any {
            var result;
            var model = this.getModel();
            if (model != null) {
                result = model.getState();
            } else {
                result = null;
            }
            return result;
        }


        public _handleModelChangeEvent(event: TS.MVP.ModelChangeEvent) {
            // just reload? - this could lead to problems
            var container = this._viewContainer;
            this.stop();
            this.destroy();
            this.init(container, false);
            this.start();
        }


    }


} 