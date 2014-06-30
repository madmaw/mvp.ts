module TS.IJQuery.Template {

    export interface IJQueryStringTemplateFactory {

        <T>(template: string): IJQueryTemplate<T>;

    }

}