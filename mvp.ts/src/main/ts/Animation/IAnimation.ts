///<reference path="AnimationStateChangeEvent.ts"/>

// Module
module TS.Animation {

    // Class
    export interface IAnimation {

        getState(): AnimationState;

        init();

        start();

        destroy();

        forceToCompletion();

        addAnimationListener(listener: IAnimationStateChangeListener );

        removeAnimationListener(listener: IAnimationStateChangeListener );
    }

}