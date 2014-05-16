module TS.MVP.Command {

    export class CompositeCommandModel extends AbstractModel implements ICommandModel {

        private _modelChangeListener: IModelChangeListener;

        constructor(private _commandModels:ICommandModel[] = []) {
            super();
            this._modelChangeListener = () => {
                this._fireModelChangeEvent();
            };
        }

        public _startedListening() {
            for (var i in this._commandModels) {
                var commandModel = this._commandModels[i];
                commandModel.addChangeListener(this._modelChangeListener);
            }
            super._startedListening();
        }

        public _stoppedListening() {
            for (var i in this._commandModels) {
                var commandModel = this._commandModels[i];
                commandModel.removeChangeListener(this._modelChangeListener);
            }
            super._stoppedListening();
        }

        public removeCommandModel(commandModel: ICommandModel) {
            if (arrayRemoveElement(this._commandModels, commandModel)) {
                if (this._isListening) {
                    commandModel.removeChangeListener(this._modelChangeListener);
                    this._fireModelChangeEvent();
                }
            }
        }

        public addCommandModel(commandModel: ICommandModel) {
            this._commandModels.push(commandModel);
            if (this._isListening) {
                commandModel.addChangeListener(this._modelChangeListener);
                this._fireModelChangeEvent();
            }
        }

        public getCommands(): Command[]{
            var allCommands = [];
            for (var i in this._commandModels) {
                var commandModel = this._commandModels[i];
                var commands = commandModel.getCommands();
                arrayPushAll(allCommands, commands);
            }
            // TODO sort these

            return allCommands;
        }

    }

} 