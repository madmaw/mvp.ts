module TS.JQuery.Template {

    export interface IJQueryAsyncPathTemplateFactory {

        <T>(path: string): JQueryPromise<IJQueryTemplate<T>>;

    }

}