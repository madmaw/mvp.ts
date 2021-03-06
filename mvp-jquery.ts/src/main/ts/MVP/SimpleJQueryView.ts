module TS.IJQuery.MVP {

    export class SimpleJQueryView implements IJQueryView {

        public static viewFactoryFromHTML(html: string): IJQueryViewFactory {
            return function (container: JQuery, params: any, prepend?: boolean): IJQueryView {
                var nodes = $.parseHTML(html);
                var jquery = $(nodes);
                return new SimpleJQueryView(jquery, container, prepend);
            };
        }

        public static viewFactoryFromPrototype(proto:JQuery): IJQueryViewFactory {
            return function (container: JQuery, params: any, prepend?: boolean): IJQueryView {
                var clone = proto.clone();
                return new SimpleJQueryView(clone, container, prepend);
            };
        }

        public static viewFactoryFromSelector(selector: string): IJQueryViewFactory {
            var html = $(selector).html();
            return SimpleJQueryView.viewFactoryFromHTML(html);
        }

        public static viewFactoryFromTemplate<T>(template: TS.IJQuery.Template.IJQueryTemplate<T>) {
            return function (container: JQuery, params: any, prepend?: boolean): IJQueryView {
                var html = template(params);
                return new SimpleJQueryView(html, container, prepend);
            };
        }

        public static viewFactoryFromTemplatePromise<T>(templatePromise: JQueryPromise<TS.IJQuery.Template.IJQueryTemplate<T>>, loadingPromises?: JQueryPromise<any>[], hint?: string) {
            var myTemplate: TS.IJQuery.Template.IJQueryTemplate<T> = null;
            templatePromise.done(function (template: TS.IJQuery.Template.IJQueryTemplate<T>) {
                myTemplate = template;
            });
            if (loadingPromises) {
                loadingPromises.push(templatePromise);
            }
            // we assume this doesn't get called until the template is loaded !!!
            return function (container: JQuery, params: any, prepend?: boolean): IJQueryView {
                if (myTemplate == null) {
                    var s = "template not loaded yet!";
                    if( hint ) {
                        s += " ("+hint+")";
                    }
                    throw s;
                }
                var html = myTemplate(params);
                return new SimpleJQueryView(html, container, prepend);
            };
        }

        public static viewFactoryFromTemplateSelector(stringTemplateFactory: TS.IJQuery.Template.IJQueryStringTemplateFactory, selector: string) {
            var templateString = $(selector).html();
            var template = stringTemplateFactory(templateString);
            return function(container: JQuery, params: any, prepend?: boolean): IJQueryView {
                var html = template(params);
                return new SimpleJQueryView(html, container, prepend);
            };
        }

        public static viewFactoryFromTemplatePath(asyncPathTemplateFactory:TS.IJQuery.Template.IJQueryAsyncPathTemplateFactory, asyncPath:string, promises?:JQueryPromise<any>[]) {
            var templatePromise = asyncPathTemplateFactory(asyncPath);
            return SimpleJQueryView.viewFactoryFromTemplatePromise(templatePromise, promises, asyncPath);
        }

        private _attached: boolean;
        public ownsSelf = true;

        constructor(public $: JQuery, private _container: JQuery, private _prepend: boolean) {
            this._attached = false;
        }

        attach(): void {
            if (!this._attached) {
                if (this._prepend) {
                    var first = this._container.children().first();
                    if (first && first.length > 0) {
                        this.$ = this.$.insertBefore(first);
                    } else {
                        //this._container.append(this.$);
                        this.$ = this.$.appendTo(this._container);
                    }
                } else {
                    // the result of appendTo is a clone of the value that goes in!
                    //this._container.append(this.$);
                    this.$ = this.$.appendTo(this._container);
                }
                this._attached = true;
            }
        }

        detach(): void {
            if (this._attached) {
                this._attached = false;
                this.$.remove();
            }
        }

        layout(): boolean {
            this.$.resize();
            return false;
        }

    }

} 