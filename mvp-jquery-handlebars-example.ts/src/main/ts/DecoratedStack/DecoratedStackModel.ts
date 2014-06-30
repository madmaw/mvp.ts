// Module  
module TS.IJQuery.MVP.HB.Example.DecoratedStack {
    // Class
    export class DecoratedStackModel extends TS.MVP.Composite.Stack.AbstractStackPresenterModel<TS.MVP.IPresenter> implements TS.IJQuery.MVP.HB.Example.TextInput.ITextInputModel {
        
        // Constructor
        constructor(
            private _topLevelController: TS.MVP.IPresenter,
            private _labelViewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            private _inputViewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            private _toolbarDecoratorFactory: (presenters: TS.MVP.IPresenter[], commandModel: TS.MVP.Command.ICommandModel) => TS.MVP.IPresenter
        ) {
            super(false);
        }

        getValue(): string {
            return "";
        }

        requestSubmit(value: string) {
            // push a new controller
            if (value != null && value.length > 0) {
                // create the label
                var decoratorController = this._createPresenter(value);
                this._push(decoratorController, value);
            }
        }

        public _createPresenter(value: string): TS.MVP.IPresenter {
            
            var labelController = new TS.IJQuery.MVP.HB.Example.Label.LabelPresenter(this._labelViewFactory);
            labelController.setModel(new TS.IJQuery.MVP.HB.Example.Label.ImmutableLabelModel(value));

            // create an input controller
            var inputController = new TS.IJQuery.MVP.HB.Example.TextInput.TextInputPresenter(this._inputViewFactory);
            inputController.setModel(this);

            var presenters: TS.MVP.IPresenter[] = [labelController, inputController];
            var commandModel = new TS.MVP.Command.SimpleCommandModel();
            // TODO back button handling
            return this._toolbarDecoratorFactory(presenters, commandModel);
        }

        public _importEntry(description: any, importCompletionCallback: TS.MVP.IModelImportStateCallback): TS.MVP.Composite.Stack.AbstractStackPresenterModelEntry<TS.MVP.IPresenter> {
            var presenter = this._createPresenter(description);
            return new TS.MVP.Composite.Stack.AbstractStackPresenterModelEntry(presenter, description);
        }

        public _exportEntry(entry: TS.MVP.Composite.Stack.AbstractStackPresenterModelEntry<TS.MVP.IPresenter>, models: TS.MVP.IModel[]): any {
            return entry.data;
        }

        /*
        public _entryToDescription(entry: templa.mvc.composite.IAbstractStackControllerModelEntry): any {
            return entry.data;
        }

        public _createEntryFromDescription(description: string): templa.mvc.composite.IAbstractStackControllerModelEntry {
            var controller = this._createController(description);
            return {
                controller: controller,
                data: description
            };
        }
        */
    }
}
