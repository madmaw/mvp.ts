// Module  
module TS.JQuery.MVP.HB.Example.DecoratedStack {
    // Class
    export class DecoratedStackModel extends TS.MVP.Composite.Stack.AbstractStackPresenterModel implements TS.JQuery.MVP.HB.Example.TextInput.ITextInputModel {
        
        // Constructor
        constructor(
            private _topLevelController: TS.MVP.IPresenter,
            private _labelViewFactory: TS.JQuery.MVP.IJQueryViewFactory,
            private _inputViewFactory: TS.JQuery.MVP.IJQueryViewFactory,
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
            
            var labelController = new TS.JQuery.MVP.HB.Example.Label.LabelPresenter(this._labelViewFactory);
            labelController.setModel(new TS.JQuery.MVP.HB.Example.Label.ImmutableLabelModel(value));

            // create an input controller
            var inputController = new TS.JQuery.MVP.HB.Example.TextInput.TextInputPresenter(this._inputViewFactory);
            inputController.setModel(this);

            var presenters: TS.MVP.IPresenter[] = [labelController, inputController];
            // TODO pass in the command model (back button)
            return this._toolbarDecoratorFactory(presenters, null);
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
