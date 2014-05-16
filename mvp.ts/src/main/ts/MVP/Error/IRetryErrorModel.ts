module TS.MVP.Error {

    export interface IRetryErrorModel extends IErrorModel {

        canRetry(): boolean;

        requestRetry(): void;

    }

} 