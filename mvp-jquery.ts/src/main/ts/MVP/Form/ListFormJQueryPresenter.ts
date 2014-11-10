module TS.IJQuery.MVP.Form {

    export class ListFormJQueryPresenter<ModelType extends TS.MVP.Form.IListFormModel<any[], any>> extends TS.IJQuery.MVP.List.AbstractListJQueryPresenter<ModelType> {

        private _addCallback: (event: JQueryEventObject) => void;
        private _removeCallback: (event: JQueryEventObject) => void;

        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            listItemContainerViewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            listContainerSelector: string,
            private _listItemRemoveButtonSelector: string,
            private _addButtonSelector: string,
            private _errorSelector: string,
            private _errorFormatter: IErrorFormatter,
            private _errorClass: string
        ) {
            super(viewFactory, listItemContainerViewFactory, listContainerSelector);

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
            var addButton = this.$(this._addButtonSelector);
            addButton.on('click', this._addCallback);
            // listen for remove events

            return super._doStart();
        }

        _doStop() {
            var addButton = this.$(this._addButtonSelector);
            addButton.off('click', this._addCallback);

            return super._doStop();
        }

        _handleModelChangeEvent(event: TS.MVP.ModelChangeEvent) {
            if( event.lookupExclusive(TS.MVP.Form.FORM_FIELD_FOCUS_MODEL_CHANGE) ) {
                // forcus on first list item
                if( this._positionsToListItems[0] ) {
                    var model: TS.MVP.Form.IFormModel<any, any> = <any>this._positionsToListItems[0].getPresenter().getModel();
                    model.requestFocus();
                } else {
                    // focus on the add button
                    this.$(this._addButtonSelector).focus();
                }
            } else {
                super._handleModelChangeEvent(event);
            }
        }


        _doLoad(model: ModelType) {
            for( var i in this._positionsToListItems ) {
                var listItem = this._positionsToListItems[i];
                var listItemPresenter = listItem.getPresenter();
                var listItemPresenterView: TS.IJQuery.MVP.IJQueryView = <any>listItemPresenter.getView();
                listItemPresenterView.$.find(this._listItemRemoveButtonSelector).off('click', this._removeCallback);
            }
            super._doLoad(model);
            // should have entirely cleared it
            for( var i in this._positionsToListItems ) {
                var listItem = this._positionsToListItems[i];
                var listItemPresenter = listItem.getPresenter();
                var listItemModel: TS.MVP.Form.IFormModel<any, any> = <any>listItemPresenter.getModel();
                var f = (index: number) => {
                    listItemModel.setCompletionListener(()=> {
                        // focus on the next list item
                        var nextListItem = this._positionsToListItems[index];
                        if( nextListItem != null ) {
                            var nextListItemPresenter = nextListItem.getPresenter();
                            var nextListItemModel: TS.MVP.Form.IFormModel<any, any> = <any>nextListItemPresenter.getModel();
                            nextListItemModel.requestFocus();
                        } else {
                            var addButton = this.$(this._addButtonSelector).focus();
                        }
                    });
                };
                f(parseInt(i)+1);
                var listItemPresenterView: TS.IJQuery.MVP.IJQueryView = <any>listItemPresenter.getView();
                listItemPresenterView.$.find(this._listItemRemoveButtonSelector).on('click', this._removeCallback);
            }
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