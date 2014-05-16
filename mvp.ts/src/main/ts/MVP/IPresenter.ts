module TS.MVP {



    export interface IPresenter {
        getModel(): IModel;

        load();

        start(): boolean;

        stop(): boolean;

        destroy(detachView?:boolean): boolean;

        getState(): number;

        getView(): IView;

        addChangeListener(listener: IPresenterChangeListener );

        removeChangeListener(listener: IPresenterChangeListener );

        addAnimation(animation: TS.Animation.IAnimation);

        layout(): void;
    }

}