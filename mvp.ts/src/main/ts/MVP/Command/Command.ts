module TS.MVP.Command {

    // Class
    export class Command {

        private _enabled: boolean;

        // Constructor
        constructor(private _id: string, private _commandType:CommandType, private _priority:number, private _action:() => void) {
            this._enabled = true;
        }

        public getPriority(): number {
            return this._priority;
        }

        public getCommandType(): CommandType {
            return this._commandType;
        }

        public setEnabled(_enabled: boolean) {
            this._enabled = _enabled;
        }

        public getEnabled(): boolean {
            return this._enabled;
        }

        public getId(): string {
            return this._id;
        }

        public getAction(): () => void {
            return this._action;
        }
    }
}
