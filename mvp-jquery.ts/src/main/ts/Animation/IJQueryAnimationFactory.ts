
// Module
module TS.JQuery.Animation {

    // Class
    export interface IJQueryAnimationFactory {
        (container:JQuery, target:JQuery): TS.Animation.IAnimation;
    }

}