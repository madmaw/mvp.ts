module TS.JQuery.MVP.Composite.Stack {

    export class StackJQueryPresenterAnimationFactoryBundle {
        constructor(
            public popAnimationFactory?: TS.JQuery.Animation.IJQueryAnimationFactory,
            public pushAnimationFactory?: TS.JQuery.Animation.IJQueryAnimationFactory,
            public selector?: string
        ) {
        }
    }



}