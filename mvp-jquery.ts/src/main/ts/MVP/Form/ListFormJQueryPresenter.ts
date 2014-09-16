module TS.IJQuery.MVP.Form {

    export class ListFormJQueryPresenter<ModelType extends TS.MVP.Form.IListFormModel<any[]>> extends TS.IJQuery.MVP.List.AbstractListJQueryPresenter<ModelType> {

        private _addCallback: (event: JQueryEventObject) => void;
        private _removeCallback: (event: JQueryEventObject) => void;

        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            listItemContainerViewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            private _listItemRemoveButtonSelector: string,
            private _addButtonSelector: string,
            private _errorSelector: string,
            private _errorFormatter: IErrorFormatter,
            private _errorClass: string
        ) {
            super(viewFactory, listItemContainerViewFactory);

            this._addCallback = () => {
                var model = this.getModel();
                model.requestAddRow();
            };
            this._removeCallback = (event: JQueryEventObject) => {
                var eventTarget = <any>event.target;
                for( var i in this._positionsToListItems ) {
                    var listItem = this._positionsToListItems[i];
                    var containerView = listItem.getContainerView();
                    if( containerView.$.has(eventTarget).length > 0 ) {
                        var model = this.getModel();
                        model.requestRemoveRow(i);
                        break;
                    }
                }
            };
        }

        _doStart() {
            // listen for add events
            var addButton = $(this._addButtonSelector);
            addButton.on('click', this._addCallback);
            // listen for remove events

            return super._doStart();
        }

        _doStop() {
            var addButton = $(this._addButtonSelector);
            addButton.off('click', this._addCallback);

            return super._doStop();
        }


        _doLoad(model: ModelType) {
            super._doLoad(model);
            // TODO add any remove callbacks
            if( this._errorFormatter && this._errorSelector !== undefined ) {
                // present any errors
                var errors = model.getErrors();
                var errorString = this._errorFormatter(errors);
                var errorJQuery = this.$(this._errorSelector);
                errorJQuery.html(errorString);
                if( this._errorClass ) {
                    if( errors != null && errors.length > 0 ) {
                        this.$().addClass(this._errorClass);
                    } else {
                        this.$().removeClass(this._errorClass);
                    }
                }
            }
        }

    }

}