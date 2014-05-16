module TS.JQuery.Template {

    export function jqueryAsyncPathTemplateFactoryProxy(stringTemplateFactory:IJQueryStringTemplateFactory): IJQueryAsyncPathTemplateFactory {
        return function <T>(path: string): JQueryPromise<IJQueryTemplate<T>> {
            var xhr = $.ajax(path);
            return xhr.then(function () {
                var template = xhr.responseText;
                return stringTemplateFactory(template);
            });
        };
    }

    export function jqueryLocalTemplateFactoryProxy<T>(stringTemplateFactory: IJQueryStringTemplateFactory, localSelector: string): IJQueryTemplate<T> {
        var template = $(localSelector).html();
        return stringTemplateFactory(template);
    }

}