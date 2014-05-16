// Module
module TS.JQuery.MVP.Command {

    // Class
    export class CommandJQueryViewDescription {

        public static delegatingCommandJQueryViewDescriptionFactoryFromMap(
            defaultDescriptionFactory: ICommandJQueryViewDescriptionFactory,
            idsToDescriptionFactories: { [_: string]: ICommandJQueryViewDescriptionFactory; }
        ): ICommandJQueryViewDescriptionFactory {

            return function(container: JQuery, command: TS.MVP.Command.Command): CommandJQueryViewDescription {
                var factory = this._idsToDescriptionFactories[command.getId()];
                if (factory == null) {
                    factory = this._defaultDescriptionFactory;
                }
                return factory.create(container, command);
            }
        }

        public static commandJQueryViewDescriptionFactoryFromTemplate(
            template: TS.JQuery.Template.IJQueryTemplate<TS.MVP.Command.Command>, 
            actionSelectorFactory: (command:TS.MVP.Command.Command)=>string
        ): ICommandJQueryViewDescriptionFactory {
            return function(container: JQuery, command: TS.MVP.Command.Command): CommandJQueryViewDescription {
                //options[this._idAttributeName] = id;
                var actionSelector = actionSelectorFactory(command);
                var viewJQuery = template(command);
                
                var view = new SimpleJQueryView(viewJQuery, container, false);
                return new CommandJQueryViewDescription(view, actionSelector);
            }

        }

        public static commandJQueryViewDescriptionFactoryFromTemplatePromise<T>(
            templatePromise: JQueryPromise<TS.JQuery.Template.IJQueryTemplate<TS.MVP.Command.Command>>,
            actionSelectorFactory: (command: TS.MVP.Command.Command) => string,
            loadingPromises?: JQueryPromise<any>[]
        ): ICommandJQueryViewDescriptionFactory {
            var myTemplate: TS.JQuery.Template.IJQueryTemplate<TS.MVP.Command.Command> = null;
            templatePromise.done(function (template: TS.JQuery.Template.IJQueryTemplate<TS.MVP.Command.Command>) {
                myTemplate = template;
            });
            if (loadingPromises) {
                loadingPromises.push(templatePromise);
            }
            // we assume this doesn't get called until the template is loaded !!!
            return function (container: JQuery, command: TS.MVP.Command.Command): CommandJQueryViewDescription {
                if (myTemplate == null) {
                    throw "template not loaded yet!";
                }
                return CommandJQueryViewDescription.commandJQueryViewDescriptionFactoryFromTemplate(myTemplate, actionSelectorFactory)(container, command);
            };
        }

        public static commandJQueryViewDescriptionFactoryFromTemplatePath(
            asyncPathTemplateFactory: TS.JQuery.Template.IJQueryAsyncPathTemplateFactory,
            asyncPath: string,
            actionSelectorFactory: (command: TS.MVP.Command.Command) => string,
            promises?: JQueryPromise<any>[]
        ): ICommandJQueryViewDescriptionFactory {
            var templatePromise = asyncPathTemplateFactory(asyncPath);
            return CommandJQueryViewDescription.commandJQueryViewDescriptionFactoryFromTemplatePromise(templatePromise, actionSelectorFactory, promises);
        }


        // Constructor
        constructor (private _view:IJQueryView, private _actionElementSelector:string) { }

        public getView(): IJQueryView {
            return this._view;
        }

        public getActionElementSelector(): string {
            return this._actionElementSelector;
        }
    }

}

