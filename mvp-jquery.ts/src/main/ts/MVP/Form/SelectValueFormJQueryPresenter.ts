module TS.IJQuery.MVP.Form {
    export class SelectValueFormJQueryPresenter extends AbstractFormJQueryPresenter<TS.MVP.Form.IFormModel<any>> {
        public static EVENT_NAMES = "change";

        private _onChangeCallback: (event: JQueryEventObject) => void;

        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            errorSelector: string,
            errorFormatter: IErrorFormatter,
            errorClass: string,
            private _selectSelector: string,
            private _options?: {[_:string]: string}
            ) {
            super(viewFactory, errorSelector, errorFormatter, errorClass);

            this._onChangeCallback = () => {
                var select = this.$(this._selectSelector);
                var value = select.val();
                this.getModel().setValue(value, false);
            };
        }

        _doInit() {
            super._doInit();
            // add in the options
            if( this._options ) {
                var select = this.$(this._selectSelector);
                var html = "";
                for( var key in this._options ) {
                    var value = this._options[key];
                    html += "<option value='"+key+"'>"+value+"</option>";
                }
                select.html(html)
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

        _doLoad(model: TS.MVP.Form.IFormModel<string>) {
            super._doLoad(model);
            this.$(this._selectSelector).val(model.getValue());
        }
    }
}