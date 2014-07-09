
// Module
module TS.Animation {

    // Class
    export class AbstractAnimation implements IAnimation {

        private _state: AnimationState;
        private _animationChangeListeners: { (source: IAnimation, changeEvent: AnimationStateChangeEvent): void; }[];


        // Constructor
        constructor() {
            this._state = AnimationState.Created;
            this._animationChangeListeners = [];
        }

        public getState(): AnimationState {
            return this._state;
        }

        public init() {
            if (this._doInit()) {
                this._state = AnimationState.Initialized;
                this._fireAnimationStateChangeEvent(new AnimationStateChangeEvent(this._state));
            }
        }

        public _doInit(): boolean {
            return true;
        }

        public start() {
            if (this._doStart()) {
                this._state = AnimationState.Started;
                this._fireAnimationStateChangeEvent(new AnimationStateChangeEvent(this._state));
            }
        }

        public _doStart(): boolean {
            return true;
        }

        public destroy() {
            if (this._doDestroy()) {
                this._state = AnimationState.Finished;
                this._fireAnimationStateChangeEvent(new AnimationStateChangeEvent(this._state));
            }
        }

        public _doDestroy(): boolean {
            return true;
        }

        public forceToCompletion() {
            var state = this.getState();
            if( state < AnimationState.Finished ) {
                if( state < AnimationState.Started ) {
                    if( state < AnimationState.Initialized ) {
                        this._doInit();
                    }
                    this._doStart();
                }
                this._doDestroy();
            }
        }

        public _fireAnimationStateChangeEvent(changeEvent: AnimationStateChangeEvent) {
            for (var i in this._animationChangeListeners) {
                var animationChangeListener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void = this._animationChangeListeners[i];
                animationChangeListener(this, changeEvent);
            }
        }

        public addAnimationListener(listener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void ) {
            this._animationChangeListeners.push(listener);
        }

        public removeAnimationListener(listener: (source: IAnimation, changeEvent: AnimationStateChangeEvent) => void ) {
            arrayRemoveElement(this._animationChangeListeners, listener);
        }


    }

}