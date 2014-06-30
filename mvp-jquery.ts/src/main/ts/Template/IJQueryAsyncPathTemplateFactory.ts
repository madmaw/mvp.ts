module TS.IJQuery.Template {

    export interface IJQueryAsyncPathTemplateFactory {

        <T>(path: string): JQueryPromise<IJQueryTemplate<T>>;

    }

}