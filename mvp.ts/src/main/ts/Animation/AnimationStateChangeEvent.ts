// Module
module TS.Animation {

    // Class
    export class AnimationStateChangeEvent {
        // Constructor
        constructor(private _animationState:AnimationState) {
        }

        public getAnimationState(): AnimationState {
            return this._animationState;
        }
    }
}
