// Module
module TS.JQuery.MVP.HB.Example.Label {

    // Class
    export class LabelPresenter extends TS.JQuery.MVP.AbstractJQueryPresenter<ILabelModel> {
        
        constructor(viewFactory: TS.JQuery.MVP.IJQueryViewFactory, private _labelElementSelector:string = ".label_presenter_label") {
            super(viewFactory);
        }

        public _getViewFactoryParams(): any {
            return {labelElementSelector: this._labelElementSelector};
        }

        public _doLoad(model: ILabelModel) {
            var labelModel = model;
            var label = labelModel.getLabel(); 
            this.$(this._labelElementSelector).text(label);
        }
    }


}