module TS.IJQuery.MVP {

    export class BorrowedJQueryView implements IJQueryView {

        public static viewFactoryFromSelector(selector?: string) {
            return function (container: JQuery, params:any, prepend?: boolean): IJQueryView {
                var jquery;
                if (selector) {
                    jquery = TS.IJQuery.jquerySelectFromRoot(container, selector);
                } else {
                    jquery = container;
                }
                return new BorrowedJQueryView(jquery);
            }
        }

        public static viewFactoryEmpty() {
            return function (container: JQuery, params:any, prepend?: boolean): IJQueryView {
                return new BorrowedJQueryView(container);
            }
        }

        public ownsSelf = false;

        constructor(public $: JQuery) {
        }

        attach(): void {
            // someone else will attach/detach the elements
        }

        detach(): void {
            // someone else will attach/detach the elements
        }

        layout(): boolean {
            // check we aren't the window, one of the few things that actually fire a resize event on their own!
            if( this.$.index($(window)) < 0 ) {
                this.$.resize();
            }
            return false;
        }


    }

}