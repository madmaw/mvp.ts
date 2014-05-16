module TS.JQuery.Template.HB {

    export function handlebarsJQueryStringTemplateFactory(compileOptions?:any, processOptions?:any): IJQueryStringTemplateFactory {
        // check for MS oddities
        return function <T>(template: string): IJQueryTemplate<T> {
            var handlebarsTemplate = Handlebars.compile(template, compileOptions);
            return function (t: T): JQuery {
                var out = handlebarsTemplate(t, processOptions);
                return $($.parseHTML(out));
            }
        }
    }

    export function handlebarsJQueryAsyncPathTemplateFactory(compileOptions?: any, processOptions?: any): IJQueryAsyncPathTemplateFactory {
        var stringTemplateFactory = handlebarsJQueryStringTemplateFactory(compileOptions, processOptions);
        var asyncPathTemplateFactory = jqueryAsyncPathTemplateFactoryProxy(stringTemplateFactory)
        return function <T>(path: string): JQueryPromise<IJQueryTemplate<T>> {
            return asyncPathTemplateFactory(path);
        }
    }

}