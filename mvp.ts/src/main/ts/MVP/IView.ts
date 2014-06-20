// Module
module TS.MVP {

    export interface IView {

        attach(): void;

        detach(): void;

        /**
         * called when the view should check it's layout (typically on the window resizing), return true if the presenter should 
         * recreate itself entirely (stop, destroy, init, start) because the view needs to change elements. If returning true, then
         * the call to layout should do nothing (the presenter will destroy/recreate anyway)
         */
        layout(): boolean;
    }

}

