module TS.MVP.Form {
    export class FormFieldModelChangeDescription extends ModelChangeDescription {

        public static FORM_FIELD_MODEL_CHANGE = "FormFieldModelChange";

        constructor(public fieldValueChangeKeys:string[], public fieldValidationChangeKeys: string[]) {
            super(FormFieldModelChangeDescription.FORM_FIELD_MODEL_CHANGE);
        }



    }
}