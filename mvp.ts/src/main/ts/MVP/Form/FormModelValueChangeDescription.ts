module TS.MVP.Form {
    export class FormModelValueChangeDescription extends ModelChangeDescription {
        public static CHANGE_TYPE_FORM_VALUE = "formValueChanged";

        constructor() {
            super(FormModelValueChangeDescription.CHANGE_TYPE_FORM_VALUE);
        }
    }
}