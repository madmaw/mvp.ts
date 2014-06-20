// Module
module TS.JQuery.MVP.HB.Example.BasicStack {


    // Class
    export class BasicStackModel extends TS.MVP.Composite.Stack.AbstractStackPresenterModel<TS.MVP.IPresenter> implements TS.JQuery.MVP.HB.Example.TextInput.ITextInputModel {

        // Constructor
        constructor(private _labelViewFactory: TS.JQuery.MVP.IJQueryViewFactory) {
            super(true);
        }

        getValue(): string {
            return "";
        }

        requestSubmit(value: string) {
            // push a new controller
            // TODO  this should probably be created via a factory rather than explicitly done here
            var labelPresenter = this._createPresenter(value);
            this._push(labelPresenter);
        }

        private _createPresenter(value:string): TS.MVP.IPresenter {
            var labelPresenter = new TS.JQuery.MVP.HB.Example.Label.LabelPresenter(this._labelViewFactory);
            labelPresenter.setModel(new TS.JQuery.MVP.HB.Example.Label.ImmutableLabelModel(value));
            
            return labelPresenter;
        }


        public _importEntry(description: any, importCompletionCallback: TS.MVP.IModelImportStateCallback): TS.MVP.Composite.Stack.AbstractStackPresenterModelEntry<TS.MVP.IPresenter> {
            var presenter = this._createPresenter(description);
            if (importCompletionCallback) {
                importCompletionCallback([]);
            }
            return new TS.MVP.Composite.Stack.AbstractStackPresenterModelEntry(presenter);
        }

        public _exportEntry(entry: TS.MVP.Composite.Stack.AbstractStackPresenterModelEntry<TS.MVP.IPresenter>, models: TS.MVP.IModel[]): any {
            var model = <TS.JQuery.MVP.HB.Example.Label.ILabelModel>entry.presenter.getModel();
            return model.getLabel();
        }


        /*
        public _entryToDescription(entry: templa.mvc.composite.IAbstractStackControllerModelEntry): any {
            var model:templa.dom.samples.mvc.controller.label.ImmutableLabelModel = <any>entry.controller.getModel();
            return model.getLabel();
        }

        public _createEntryFromDescription(description: string): TS.MVP.Composite.IAbstractStackControllerModelEntry {
            var controller = this._createPresenter(description);
            return {
                controller: controller
            };
        }
        */

    }
}