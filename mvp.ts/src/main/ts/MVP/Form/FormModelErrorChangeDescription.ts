module TS.MVP.Form {

    export class FormModelErrorChangeDescription extends ModelChangeDescription {

        public static CHANGE_TYPE_FORM_ERROR = "formErrorChanged"

        constructor(public errors: string[]) {
            super(FormModelErrorChangeDescription.CHANGE_TYPE_FORM_ERROR);
        }
    }
}