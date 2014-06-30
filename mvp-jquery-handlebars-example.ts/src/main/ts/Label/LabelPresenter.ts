// Module
module TS.IJQuery.MVP.HB.Example.Label {

    // Class
    export class LabelPresenter extends TS.IJQuery.MVP.AbstractJQueryPresenter<ILabelModel> {
        
        constructor(viewFactory: TS.IJQuery.MVP.IJQueryViewFactory, private _labelElementSelector:string = ".label_presenter_label") {
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