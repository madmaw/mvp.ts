module TS.MVP.Command {

    export class SimpleCommandModel extends AbstractModel implements ICommandModel {

        constructor(private _commands:Command[] = []) {
            super();
        }

        public addCommand(command: Command) {
            this._commands.push(command);
            // TODO include description of change
            this._fireModelChangeEvent();
        }

        public removeCommand(command: Command) {
            if (arrayRemoveElement(this._commands, command)) {
                // TODO include description of change
                this._fireModelChangeEvent();
            }
        }

        public updateCommand(command: Command) {
            // TODO : include description of change
            this._fireModelChangeEvent();
        }

        public getCommands() {
            return this._commands;
        }

    }

} 