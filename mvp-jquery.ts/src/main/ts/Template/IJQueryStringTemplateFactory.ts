module TS.JQuery.Template {

    export interface IJQueryStringTemplateFactory {

        <T>(template: string): IJQueryTemplate<T>;

    }

}