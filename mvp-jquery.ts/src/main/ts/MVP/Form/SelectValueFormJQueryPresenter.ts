module TS.IJQuery.MVP.Form {
    export class SelectValueFormJQueryPresenter<T> extends AbstractFormJQueryPresenter<TS.MVP.Form.IFormModel<T, any>> {
        public static EVENT_NAMES = "change";

        private _onChangeCallback: (event: JQueryEventObject) => void;

        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            private _options: {[_:string]: T},
            private _selectSelector?: string,
            errorSelector?: string,
            errorFormatter?: IErrorFormatter,
            errorClass?: string
            ) {
            super(viewFactory, errorSelector, errorFormatter, errorClass);

            this._onChangeCallback = () => {
                var select = this.$(this._selectSelector);
                var id = select.val();
                var value: T;
                if( _options != null ) {
                    value = _options[id];
                } else {
                    value = <any>id;
                }
                this.getModel().setValue(value, false);
            };
        }

        _handleModelChangeEvent(event: TS.MVP.ModelChangeEvent) {
            if( event.lookupExclusive(TS.MVP.Form.FORM_FIELD_FOCUS_MODEL_CHANGE) ) {
                var select = this.$(this._selectSelector);
                select.focus();
            } else {
                super._handleModelChangeEvent(event);
            }
        }

        _doStart() {
            var select = this.$(this._selectSelector);
            select.on(SelectValueFormJQueryPresenter.EVENT_NAMES, this._onChangeCallback);

            return super._doStart();
        }

        _doStop() {
            var select = this.$(this._selectSelector);
            select.off(SelectValueFormJQueryPresenter.EVENT_NAMES, this._onChangeCallback);

            return super._doStop();
        }

        _doLoad(model: TS.MVP.Form.IFormModel<T, any>) {
            super._doLoad(model);
            var select = this.$(this._selectSelector);
            var id: string = null;
            var selectedValue = model.getValue();
            for( var key in this._options ) {
                var value = this._options[key];
                if( value == selectedValue ) {
                    id = key;
                    break;
                }
            }
            select.val(id);
        }
    }
}