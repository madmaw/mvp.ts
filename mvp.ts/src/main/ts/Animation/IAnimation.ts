///<reference path="AnimationStateChangeEvent.ts"/>

// Module
module TS.Animation {

    // Class
    export interface IAnimation {

        getState(): AnimationState;

        init();

        start();

        destroy();

        addAnimationListener(listener: IAnimationStateChangeListener );

        removeAnimationListener(listener: IAnimationStateChangeListener );
    }

}