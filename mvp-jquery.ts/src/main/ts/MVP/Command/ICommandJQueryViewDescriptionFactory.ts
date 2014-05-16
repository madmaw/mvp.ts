// Module
module TS.JQuery.MVP.Command {
    export interface ICommandJQueryViewDescriptionFactory {
        (container: JQuery, command: TS.MVP.Command.Command): CommandJQueryViewDescription;
    }
}