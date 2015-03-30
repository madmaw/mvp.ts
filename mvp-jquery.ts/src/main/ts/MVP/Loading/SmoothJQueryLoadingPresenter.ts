module TS.IJQuery.MVP.Loading {

    export class SmoothJQueryLoadingPresenter extends TS.IJQuery.MVP.Stateful.TemplatingStatefulJQueryPresenter<TS.MVP.Loading.LoadingModelState> {

        private _adjustedState: TS.MVP.Loading.LoadingModelState;
        private _originalState: TS.MVP.Loading.LoadingModelState;
        private _timeout: number;
        private _timeoutHandle: any;

        constructor(viewFactory: IJQueryViewFactory, private _steps: number, private _maxTimeoutMillis: number = 100) {
            super(viewFactory);
        }

        private toProgress(progress: number, maxProgress: number) {
            if( maxProgress > 0 ) {
                return Math.min(this._steps, Math.round((progress * this._steps) / maxProgress))
            } else {
                return progress;
            }
        }

        private calculateState(force?:boolean) {
            var state = this.getModel().getState();
            if( force || this._originalState == null || this._originalState.progress > state.progress && state.progress == 0 ) {
                this._originalState = state;
                var state = this.getModel().getState();
                this._originalState = state;
                if( state.maxProgress > 0 ) {
                    this._adjustedState = new TS.MVP.Loading.LoadingModelState(
                        this.toProgress(state.progress, state.maxProgress),
                        this._steps,
                        state.message
                    );
                } else {
                    this._adjustedState = state;
                }
            }
        }


        public _getViewFactoryParams(): any {
            var result = this._adjustedState;
            if( result == null ) {
                result = super._getViewFactoryParams();
            }
            return result;
        }

        public _doLoad(model: TS.MVP.Stateful.IStatefulModel<TS.MVP.Loading.LoadingModelState>) {
            this.calculateState();
            super._doLoad(model);
        }

        public _doStart(): boolean {
            this.doTimeout(this._adjustedState == null);
            return super._doStart();
        }

        public _doStop(): boolean {
            if( this._timeoutHandle != null ) {
                window.clearTimeout(this._timeoutHandle);
                this._timeoutHandle = null;
            }
            return super._doStop();
        }

        public _handleModelChangeEvent(event: TS.MVP.ModelChangeEvent) {
            this.doTimeout(true);
            super._handleModelChangeEvent(event);
        }

        private doTimeout(reset: boolean) {
            if( this._timeoutHandle != null ) {
                window.clearTimeout(this._timeoutHandle);
            }
            if( reset ) {
                this._timeout = this._maxTimeoutMillis;
                this.calculateState(true);
            }
            if( this._originalState && this._adjustedState ) {
                this._timeoutHandle = window.setTimeout(() => {
                    //this._timeout = this._timeout * 2;
                    this._timeoutHandle = null;
                    // increment the adjusted state
                    var maxProgress = this.toProgress(this._originalState.progress + 1, this._originalState.maxProgress);
                    if( maxProgress >= this._adjustedState.progress && this._adjustedState.progress < this._steps) {
                        this._adjustedState.progress++;
                        this._redraw();
                        // redraw will probably cause this timeout to be set, then removed, then set again?!
                        this.doTimeout(false);
                    }
                }, this._timeout);
            }
        }

    }

}