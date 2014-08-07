module TS.MVP.Composite.Stack {

    export class AbstractStackPresenterModelEntry<PresenterType extends IPresenter> {

        constructor(public presenter: PresenterType, public data?: any, public presenterName?: string) {
        }
    }

} 