module TS.JQuery.MVP.Command {

    // Class
    export class ToolbarCommandJQueryPresenter<ModelType extends TS.MVP.Command.ICommandModel> extends AbstractJQueryPresenter<ModelType> {

        private _backViews: IJQueryView[];
        private _generalViews: IJQueryView[];

        // Constructor
        constructor(
            _viewFactory: IJQueryViewFactory,
            private _commandViewDescriptionFactory:ICommandJQueryViewDescriptionFactory,
            private _backContainerSelector: string = ".toolbar_command_jquery_presenter_back_container",
            private _generalContainerSelector: string = ".toolbar_command_jquery_presenter_general_container"
        ) {
            super(_viewFactory);

            this._backViews = [];
            this._generalViews = [];
        }

        public _getViewFactoryParams() {
            return {
                backContainerSelector: this._backContainerSelector,
                generalContainerSelector: this._generalContainerSelector
            }
        }

        public _doDestroy(detachView?: boolean) {
            if (detachView == false) {
                // TODO disable onclicks
                this._backViews = [];
                this._generalViews = [];
            } else {
                this._clear();
            }
            var result = super._doDestroy(detachView);
            return result;
        }

        public _detachViews() {
            // remove all the existing commands
            for (var i in this._backViews) {
                var backView = this._backViews[i];
                backView.detach();
            }

            // remove all the general commands
            for (var i in this._generalViews) {
                var generalView = this._generalViews[i];
                generalView.detach();
            }
        }



        public _clear() {
            this._detachViews();
            this._backViews = [];
            this._generalViews = [];
        }

        public _doLoad(model: TS.MVP.Command.ICommandModel) {
            var commandControllerModel = model;
            var commands = commandControllerModel.getCommands();

            this._clear();

            // TODO should probably sort the commands
            for (var i in commands) {
                var command = commands[i];
                var container: JQuery;
                var selector: string;
                var views;
                if (command.getCommandType() == TS.MVP.Command.CommandType.Back) {
                    selector = this._backContainerSelector;
                    views = this._backViews;
                } else {
                    selector = this._generalContainerSelector;
                    views = this._generalViews;
                }
                container = this.$(selector);
                if (container.length == 0) {
                    throw "no container for selector " + selector;
                }
                var actionElementView: CommandJQueryViewDescription = this._commandViewDescriptionFactory(container, command);
                var actionElementSelector = actionElementView.getActionElementSelector();
                var view = actionElementView.getView();
                view.attach();
                var actionElements: JQuery = jquerySelectFromRoot(view.$, actionElementSelector);
                actionElements.click(() => {
                    // hope this works
                    (command.getAction())();
                });
                views.push(view);
            }

        }

    }

}
