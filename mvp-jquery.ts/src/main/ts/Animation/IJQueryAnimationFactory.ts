
// Module
module TS.IJQuery.Animation {

    // Class
    export interface IJQueryAnimationFactory {
        (container:JQuery, target:JQuery): TS.Animation.IAnimation;
    }

}