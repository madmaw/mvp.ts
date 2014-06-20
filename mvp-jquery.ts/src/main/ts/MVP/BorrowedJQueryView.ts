module TS.JQuery.MVP {

    export class BorrowedJQueryView implements IJQueryView {

        public static viewFactoryFromSelector(selector?: string) {
            return function (container: JQuery, params:any, prepend?: boolean): IJQueryView {
                var jquery;
                if (selector) {
                    jquery = container.find(selector);
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
            return false;
        }


    }

}