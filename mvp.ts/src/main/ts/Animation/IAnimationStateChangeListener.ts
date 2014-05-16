module TS.Animation {

    export interface IAnimationStateChangeListener {
        (source: IAnimation, changeEvent: AnimationStateChangeEvent): void ;
    }

} 