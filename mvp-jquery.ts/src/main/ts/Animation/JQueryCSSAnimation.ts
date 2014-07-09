
// Module
module TS.IJQuery.Animation {

     
    // Class
    export class JQueryCSSAnimation extends TS.Animation.AbstractAnimation {

        public static cssAnimationEndEventNames = "animationend webkitAnimationEnd oanimationend MSAnimationEnd";

        public static animationFactory(clazz: string, maxTimeMillis?: number, lifecycleFunction?: (animationState: TS.Animation.AnimationState, target: JQuery) => void, permanentAddClasses?: string[], permanentRemoveClasses?: string[]): IJQueryAnimationFactory {
            return function(container: JQuery, target: JQuery): TS.Animation.IAnimation {
                return new JQueryCSSAnimation(target, clazz, maxTimeMillis, lifecycleFunction, permanentAddClasses, permanentRemoveClasses);
            }
        }

        private _animationCompletionListener: EventListener;
        

        // Constructor
        constructor(
            private _target: JQuery,
            private _class: string,
            private _maxTimeMillis?: number,
            private _lifecycleFunction?: (state: TS.Animation.AnimationState, target:JQuery) => void,
            private _permanentAddClasses?: string[],
            private _permanentRemoveClasses?: string[]
            ) {
            super();
            this._animationCompletionListener = () => {
                this.destroy();
            };
        }

        public _doInit(): boolean {
            this._target.on(JQueryCSSAnimation.cssAnimationEndEventNames, this._animationCompletionListener);
            if (this._lifecycleFunction != null) {
                this._lifecycleFunction(TS.Animation.AnimationState.Initialized, this._target);
            }
            return true;
        }

        public _doStart(): boolean {
            if( !this._target.hasClass(this._class) ) {
                this._target.addClass(this._class);
            }
            if( this._permanentAddClasses ) {
                for( var i in this._permanentAddClasses ) {
                    var permanentAddClass = this._permanentAddClasses[i];
                    if( !this._target.hasClass(permanentAddClass) ) {
                        this._target.addClass(permanentAddClass);
                    }
                }
            }
            if( this._permanentRemoveClasses ) {
                for( var i in this._permanentRemoveClasses ) {
                    var permanentRemoveClass = this._permanentRemoveClasses[i];
                    this._target.removeClass(permanentRemoveClass);
                }
            }
            // force destroy if max time millis supplied
            if (this._maxTimeMillis != null) {
                setTimeout(this._animationCompletionListener, this._maxTimeMillis);
            }
            if (this._lifecycleFunction != null) {
                this._lifecycleFunction(TS.Animation.AnimationState.Started, this._target);
            }
            return true;
        }

        public _doDestroy(): boolean {
            this._target.off(JQueryCSSAnimation.cssAnimationEndEventNames, this._animationCompletionListener);
            // remove this class

            var result;
            if (this._target.hasClass(this._class)) {
                this._target.removeClass(this._class);
                result = true;
                if (this._lifecycleFunction != null) {
                    // slight delay to allow CSS to complete?!
                    var delay;
                    if (this._maxTimeMillis != null) {
                        // assume that any queued up animations will run on similar timescales
                        delay = this._maxTimeMillis / 2;
                    } else {
                        delay = 100;
                    }
                    window.setTimeout(() => {
                        this._lifecycleFunction(TS.Animation.AnimationState.Finished, this._target);
                    }, delay);
                }

            } else {
                result = false;
            }
            return result;
        }

    }

}