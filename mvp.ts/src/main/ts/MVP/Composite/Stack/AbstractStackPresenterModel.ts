///<reference path="../AbstractCompositePresenterModel.ts"/>

// Module
module TS.MVP.Composite.Stack {



    // Class
    export class AbstractStackPresenterModel<PresenterType extends IPresenter> extends AbstractCompositePresenterModel implements IStackPresenterModel {

        public _stack: AbstractStackPresenterModelEntry<PresenterType>[];
        

        // Constructor
        constructor(private _allowEmptyStack?:boolean, public _presentersToDisplay?:number) {
            super();
            this._stack = [];
            if (this._presentersToDisplay == null) {
                this._presentersToDisplay = 1;
            }
        }

        public _setPresentersToDisplay(presentersToDisplay: number) {
            if (this._presentersToDisplay != presentersToDisplay) {
                this._presentersToDisplay = presentersToDisplay;
                // assume everything changed
                 this._fireModelChangeEvent();
            }
        }

        public getPresenters(): IPresenter[]{
            var result: IPresenter[] = [];
            var remainingPresenters = this._presentersToDisplay;
            var index = Math.max(0, this._stack.length - this._presentersToDisplay);
            while (remainingPresenters > 0 && index < this._stack.length) {
                result.push(this._stack[index].presenter);
                remainingPresenters--;
                index++;
            }
            return result;
        }

        public _getDescribedPresenters(): IPresenter[] {
            return this.getPresenters();
        }

        public isStackEmpty(): boolean {
            return this._stack.length == 0;
        }

        public canPop(): boolean {
            return !this.isStackEmpty() && this._allowEmptyStack || this._stack.length > this._presentersToDisplay;
        }

        public requestPop(): void {
            if (this.canPop()) {
                this._pop();
            }
        }

        public _ensureVisible(presenter: PresenterType, suppressFireDescriptionChangeEvent?:boolean): boolean {
            // pop back to this presenter
            var result;
            var index = this._indexOf(presenter);
            if (index != null) {
                result = true;
                while (index < this._stack.length - this._presentersToDisplay) {
                    this._pop(false, suppressFireDescriptionChangeEvent);
                }
            } else {
                result = false;
            }
            return result;
        }

        public _popTo(presenter: PresenterType, suppressFireDescriptionChangeEvent?: boolean): void {

            while (true) {
                var peeked = this.peek();
                if (peeked == null || peeked == presenter) {
                    break;
                } else {
                    this._pop(false, suppressFireDescriptionChangeEvent);
                }
            }
        }

        public _deStack(presenter: PresenterType, suppressFireModelChangeEvent?:boolean, suppressFireDescriptionChangeEvent?:boolean): void {
            // pop or just silently remove as required
            if (this.peek() == presenter) {
                this._pop(suppressFireModelChangeEvent, suppressFireDescriptionChangeEvent);
            } else {
                // just remove it silently
                for (var i in this._stack) {
                    var entry = this._stack[i];
                    if (entry.presenter == presenter) {
                        this._stack.splice(<any>i, 1);
                        this._updateListeningForStateDescriptionChanges();
                        // TODO check that it isn't visible?!
                        break;
                    }
                }
            }
        }

        public _pop(suppressFireModelChangeEvent?: boolean, suppressFireDescriptionChangeEvent?: boolean): AbstractStackPresenterModelEntry<PresenterType> {
            var result;
            if (this._stack.length > 0) {
                var previousEntry = this._stack[this._stack.length - 1];
                var entries = this._stack.splice(this._stack.length - 1, 1);
                if (suppressFireModelChangeEvent != true) {
                    var changeDescription = new StackPresenterModelChangeDescription(stackPresenterModelEventTypePopped, previousEntry.presenter, this.peek(), previousEntry.presenterName);
                    // TODO need a popchange (reverse of push change)
                    this._fireModelChangeEvent(changeDescription, true);
                }
                if (suppressFireDescriptionChangeEvent != true) {
                    this._fireStateChangeOperation(this, new AbstractStackPresenterPopModelStateChangeOperation(this, entries[0]));
                }
                result = previousEntry;
                this._updateListeningForStateDescriptionChanges();
            } else {
                result = null;
            }
            return result;
        }

        public _push(presenter: PresenterType, data?: any, suppressFireModelChangeEvent?: boolean, suppressFireDescriptionChangeEvent?: boolean, presenterName?: string): void {
            this._pushEntry(
                new AbstractStackPresenterModelEntry(presenter, data, presenterName),
                suppressFireModelChangeEvent,
                suppressFireDescriptionChangeEvent
            );
        }

        public _contains(presenter: PresenterType): boolean {
            return this._indexOf(presenter) != null;
        }

        public _indexOf(presenter: PresenterType): number {
            var result: number = null;
            for (var i = this._stack.length; i > 0;) {
                i--;
                var c = this._stack[i].presenter;
                if (c == presenter) {
                    result = i;
                    break;
                }
            }
            return result;
        }

        public _pushEntryGetChange(entry: AbstractStackPresenterModelEntry<PresenterType>, suppressFireModelChangeEvent?: boolean): IModelStateChangeOperation {
            var previousPresenter = this.peek();
            this._stack.push(entry);
            if (suppressFireModelChangeEvent != true) {
                var description = new StackPresenterModelChangeDescription(stackPresenterModelEventTypePushed, previousPresenter, entry.presenter, entry.presenterName);
                this._fireModelChangeEvent(description, true);
            }
            this._updateListeningForStateDescriptionChanges();
            return new AbstractStackPresenterPushModelStateChangeOperation(this, entry);
        }

        public _pushEntry(entry: AbstractStackPresenterModelEntry<PresenterType>, suppressFireModelChangeEvent?: boolean, suppressFireDescriptionChangeEvent?: boolean) {
            var change = this._pushEntryGetChange(entry, suppressFireModelChangeEvent);
            if (suppressFireDescriptionChangeEvent != true) {
                this._fireStateChangeOperation(this, change);
            }
        }

        public peek(): PresenterType {
            var result: PresenterType;
            if (this._stack.length > 0) {
                result = this._stack[this._stack.length - 1].presenter;
            } else {
                result = null;
            }
            return result;
        }

        public exportState(models?: IModel[]): any {
            models = this._checkModels(models);
            var result = [];
            for (var i in this._stack) {
                var entry = this._stack[i];
                var description: any = this._exportEntry(entry, models);
                result.push(description);
            }
            return result;
        }

        public importState(description: any, importCompletionCallback: IModelImportStateCallback) {
            var result: ModelStateChangeEvent[] = [];
            var descriptions: any[] = description;
            // remove everything (TODO would be nice if we tried to reuse the presenter instead)
            while (!this.isStackEmpty()) {
                this._pop(true, true);
            }
            for (var i in descriptions) {
                var presenterDescription = descriptions[i];
                var entry = this._importEntry(presenterDescription, function(changes: ModelStateChangeEvent[]) {
                    // TODO implement sensibly
                });
                if (entry != null) {
                    var change = this._pushEntryGetChange(entry, true);
                    if (change) {
                        var event = new ModelStateChangeEvent(change);
                        result.push(event);
                    }
                }
            }
            if( importCompletionCallback ) {
                importCompletionCallback(result);
            }
        }

        public _exportEntry(entry: AbstractStackPresenterModelEntry<PresenterType>, models: IModel[]): any {
            return null;
        }

        public _importEntry(description: any, importCompletionCallback: IModelImportStateCallback): AbstractStackPresenterModelEntry<PresenterType> {
            if( importCompletionCallback ) {
                importCompletionCallback([]);
            }
            return null;
        }

    }

}
