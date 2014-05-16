
module TS.MVP {

    // Class
    export class AbstractPresenter<ModelType extends IModel> implements IPresenterWithModel<ModelType> {

        public _model: ModelType;
        private _state: PresenterState;

        private _animations: TS.Animation.IAnimation[];
        private _animationListener: (source: TS.Animation.IAnimation, changeEvent: TS.Animation.AnimationStateChangeEvent) => void;

        private _modelOnChangeListener: (model: IModel, event: ModelChangeEvent) => void;
        private _presenterChangeListeners: IPresenterChangeListener[];

        // Constructor
        constructor() {
            this._state = PresenterState.Uninitialized;
        }

        public getModel(): ModelType {
            return this._model;
        }

        public setModel(model: ModelType) {
            if (this._state >= PresenterState.Started && this._model != null) {
                this._model.removeChangeListener(this._modelOnChangeListener);
            }
            var previousModel = this._model;
            this._model = model;
            if (this._state >= PresenterState.Started && this._model != null) {
                this._doLoad(model);
                this._model.addChangeListener(this._modelOnChangeListener);
            }
            // assume that everything has changed!
            this._firePresenterChangeEvent(new PresenterChangeEvent(true, previousModel));
        }

        public _init(): boolean {
            var result: boolean;
            if (this._state == PresenterState.Uninitialized) {
                result = this._doInit();
                if (result) {
                    this._state = PresenterState.Initialized;
                    // kick off any pending animations
                    if (this._animations != null) {
                        for (var i in this._animations) {
                            var animation: TS.Animation.IAnimation = this._animations[i];
                            animation.init();
                            animation.start();
                        }
                    }
                }
            } else {
                result = false;
            }
            return result;
        }

        public _doInit(): boolean {
            return true;
        }

        public load() {
            this._doLoad(this._model);
        }

        public _doLoad(model: ModelType) {

        }

        public getView(): IView {
            throw ("this should be overriden");
        }

        public _handleModelChangeEvent(event: ModelChangeEvent) {
            // override to get more fine-grained updates
            this._doLoad(this._model);
        }

        public start(): boolean {
            var result: boolean;
            if (this._state == PresenterState.Initialized) {
                result = this._doStart();
                if (result) {
                    this._state = PresenterState.Started;
                    // start listening on the model
                    this._modelOnChangeListener = (model: IModel, event: ModelChangeEvent) => {
                        this._handleModelChangeEvent(event);
                    };
                    this._model.addChangeListener(this._modelOnChangeListener);
                    // then load (sometimes the models will initialise/refresh themselves upon having a listener added, so it has to be done first)
                    this.load();
                }
            } else {
                result = false;
            }
            return result;
        }

        public _doStart(): boolean {
            return true;
        }

        public stop(): boolean {
            var result: boolean;
            if (this._state == PresenterState.Started) {
                result = this._doStop();
                if (result) {
                    this._state = PresenterState.Initialized;
                    // stop listening on the model
                    this._model.removeChangeListener(this._modelOnChangeListener);
                    this._modelOnChangeListener = null;
                }
            } else {
                result = false;
            }
            return result;
        }

        public _doStop(): boolean {
            return true;
        }

        public destroy(detachView: boolean = true): boolean {
            // destroy any animations
            var result: boolean;
            if (this._state == PresenterState.Initialized) {
                this._clearAnimations();
                result = this._doDestroy(detachView);
                if (result) {
                    // unfortunately the animations are going to cop it if we fail
                    this._state = PresenterState.Uninitialized;
                }
            } else {
                result = false;
            }
            return result;
        }

        public _doDestroy(detachView: boolean): boolean {
            return true;
        }

        public getState(): PresenterState {
            return this._state;
        }

        public addChangeListener(listener: IPresenterChangeListener ) {
            if (this._presenterChangeListeners == null) {
                this._presenterChangeListeners = [];
            }
            this._presenterChangeListeners.push(listener);
        }

        public removeChangeListener(listener: IPresenterChangeListener ) {
            if (this._presenterChangeListeners != null) {
                arrayRemoveElement(this._presenterChangeListeners, listener);
                if (this._presenterChangeListeners.length == 0) {
                    this._presenterChangeListeners = null;
                }
            }
        }

        public _firePresenterChangeEvent(presenterChangeEvent: PresenterChangeEvent) {
            if (this._presenterChangeListeners != null) {
                for (var i = this._presenterChangeListeners.length; i > 0;) {
                    i--;
                    var presenterChangeListener = this._presenterChangeListeners[i];
                    presenterChangeListener(this, presenterChangeEvent);
                }
            }
        }

        public addAnimation(animation: TS.Animation.IAnimation) {
            this._addAnimation(animation, false);
        }

        public layout(): void {
            var view = this.getView();
            if (view != null) {
                var recreate = view.layout();
                var state = this.getState();
                // just loading isn't enough, need to re-create
                if (recreate) {
                    if (state >= PresenterState.Started) {
                        this.stop();
                    }
                    if (state >= PresenterState.Initialized) {
                        this.destroy();
                        this._reinitialize();
                    }
                    if (state >= PresenterState.Started) {
                        this.start();
                    }
                }
            }
        }

        public _reinitialize() {
            this._init();
        }

        public _isAnimating(): boolean {
            return this._animations != null && this._animations.length > 0;
        }

        public _clearAnimations() {
            if (this._animations != null) {
                for (var i in this._animations) {
                    var animation: TS.Animation.IAnimation = this._animations[i];
                    animation.destroy();
                }
                this._animations = null;
            }
        }

        public _addAnimation(animation: TS.Animation.IAnimation, doNotStart?: boolean) {
            if (this._animations == null) {
                this._animations = [];
                this._animationListener = (source: TS.Animation.IAnimation, event: TS.Animation.AnimationStateChangeEvent) => {
                    if (event.getAnimationState() == TS.Animation.AnimationState.Finished) {
                        // remove the animation
                        this._removeAnimation(source, true);
                        this.layout();
                    }
                };
            }
            this._animations.push(animation);
            animation.addAnimationListener(this._animationListener);
            if (doNotStart != true && this._state >= PresenterState.Initialized) {
                // start the animation
                animation.init();
                animation.start();
            }
        }

        public _removeAnimation(animation: TS.Animation.IAnimation, doNotDestroy?: boolean) {
            if (this._animations != null) {
                if (arrayRemoveElement(this._animations, animation)) {
                    animation.removeAnimationListener(this._animationListener);
                }
            }
            if (doNotDestroy != true) {
                animation.destroy();
            }
        }

        public _safeTimeout(f: () => void , millis: number) {
            window.setTimeout(() => {
                if (this.getState() == PresenterState.Started) {
                    f();
                }
            }, millis);
        }
    }

}