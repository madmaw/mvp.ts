module TS.IJQuery.MVP.Composite.Stack {

    export class StackJQueryPresenterAnimationFactoryBundle {
        constructor(
            public popAnimationFactory?: TS.IJQuery.Animation.IJQueryAnimationFactory,
            public pushAnimationFactory?: TS.IJQuery.Animation.IJQueryAnimationFactory,
            public selector?: string
        ) {
        }
    }



}