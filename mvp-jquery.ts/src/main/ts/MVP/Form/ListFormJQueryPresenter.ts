module TS.IJQuery.MVP.Form {



    export class ListFormJQueryPresenter<ModelType extends TS.MVP.Form.IListFormModel<any[], any>> extends TS.IJQuery.MVP.List.AbstractListJQueryPresenter<ModelType> {

        private _addCallbacks: {[_:string]: IJQueryCallback};
        private _removeCallback: IJQueryCallback;

        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            listItemContainerViewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            listContainerSelector: string,
            private _listItemRemoveButtonSelector: string,
            private _addButtonTypesToSelectors: {[_:string]: string},
            private _errorSelector: string,
            private _errorFormatter: IErrorFormatter,
            private _errorClass: string
        ) {
            super(viewFactory, listItemContainerViewFactory, listContainerSelector);

            this._addCallbacks = {};
            for( var type in _addButtonTypesToSelectors ) {

                var f = (type) => {
                    var addCallback = (event: JQueryEventObject) => {
                        var model = this.getModel();
                        model.requestAddRow(type);
                    };
                    this._addCallbacks[type] = addCallback;
                }
                f(type);
            }
            this._removeCallback = (event: JQueryEventObject) => {
                var eventTarget = <any>event.target;
                for( var i in this._positionsToListItems ) {
                    var listItem = this._positionsToListItems[i];
                    var containerView = listItem.getContainerView();
                    if( containerView.$.has(eventTarget).length > 0 ) {
                        var model = this.getModel();
                        model.requestRemoveRow(parseInt(i));
                        break;
                    }
                }
            };
        }

        _doStart() {
            // listen for add events
            for( var type in this._addButtonTypesToSelectors ) {
                var addButtonSelector = this._addButtonTypesToSelectors[type];
                var addButton = this.$(addButtonSelector);
                var addCallback = this._addCallbacks[type];
                addButton.on('click', addCallback);
            }
            // listen for remove events

            return super._doStart();
        }

        _doStop() {
            for( var type in this._addButtonTypesToSelectors ) {
                var addButtonSelector = this._addButtonTypesToSelectors[type];
                var addButton = this.$(addButtonSelector);
                var addCallback = this._addCallbacks[type];
                addButton.off('click', addCallback);
            }

            return super._doStop();
        }

        _handleModelChangeEvent(event: TS.MVP.ModelChangeEvent) {
            if( event.lookupExclusive(TS.MVP.Form.FORM_FIELD_FOCUS_MODEL_CHANGE) ) {
                // forcus on first list item
                if( this._positionsToListItems[0] ) {
                    var model: TS.MVP.Form.IFormModel<any, any> = <any>this._positionsToListItems[0].getPresenter().getModel();
                    model.requestFocus();
                } else {
                    // focus on an add button
                    for( var type in this._addButtonTypesToSelectors ) {
                        var addButtonSelector = this._addButtonTypesToSelectors[type];
                        this.$(addButtonSelector).focus();
                        break;
                    }
                }
            } else {
                var description: TS.MVP.Form.FormModelErrorChangeDescription = <any>event.lookupExclusive(TS.MVP.Form.FormModelErrorChangeDescription.CHANGE_TYPE_FORM_ERROR);
                if( description ) {
                    this._showErrors(description.errors);
                } else {
                    super._handleModelChangeEvent(event);
                }
            }
        }

        public _appendItem(index: number) {
            var listItem = super._appendItem(index);
            var listItemPresenter = listItem.getPresenter();
            var listItemModel: TS.MVP.Form.IFormModel<any, any> = <any>listItemPresenter.getModel();
            listItemModel.setCompletionListener(()=> {
                // focus on the next list item
                var nextIndex = 1+index;
                var nextListItem = this._positionsToListItems[nextIndex];
                if( nextListItem != null ) {
                    var nextListItemPresenter = nextListItem.getPresenter();
                    var nextListItemModel: TS.MVP.Form.IFormModel<any, any> = <any>nextListItemPresenter.getModel();
                    nextListItemModel.requestFocus();
                }
            });
            var listItemPresenterView: TS.IJQuery.MVP.IJQueryView = <any>listItemPresenter.getView();
            listItemPresenterView.$.find(this._listItemRemoveButtonSelector).on('click', this._removeCallback);
            return listItem;
        }

        public _clearListItem(listItem: TS.IJQuery.MVP.List.AbstractListJQueryPresenterItem) {
            var listItemPresenter = listItem.getPresenter();
            var listItemPresenterView: TS.IJQuery.MVP.IJQueryView = <any>listItemPresenter.getView();
            listItemPresenterView.$.find(this._listItemRemoveButtonSelector).off('click', this._removeCallback);
            super._clearListItem(listItem);
        }

        _doLoad(model: ModelType) {
            super._doLoad(model);
            var errors = model.getErrors();
            this._showErrors(errors);
        }

        public _showErrors(errors: string[] ) {
            if( this._errorFormatter && this._errorSelector !== undefined ) {
                // present any errors
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