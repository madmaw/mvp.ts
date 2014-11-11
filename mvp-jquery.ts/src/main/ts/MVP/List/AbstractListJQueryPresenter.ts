module TS.IJQuery.MVP.List {

    export class AbstractListJQueryPresenter<ModelType extends TS.MVP.List.IListPresenterModel> extends TS.IJQuery.MVP.AbstractJQueryPresenter<ModelType> {

        public _positionsToListItems: { [_:number]: AbstractListJQueryPresenterItem; };
        private _typesToReusableControllers: { [_: string]: TS.MVP.IPresenter[]; };

        // Constructor
        constructor(
            viewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            private _listItemContainerViewFactory: TS.IJQuery.MVP.IJQueryViewFactory,
            private _listContainerSelector?: string
        ) {
            super(viewFactory);
            this._positionsToListItems = {};
            this._typesToReusableControllers = {};
        }

        public _initAndStart(presenter: TS.IJQuery.MVP.IJQueryPresenter, container: JQuery) {
            var state = presenter.getState();
            if (state == TS.MVP.PresenterState.Uninitialized) {
                // initialize it
                presenter.init(container);
            }
            this._start(presenter);
        }

        public _start(presenter: TS.MVP.IPresenter) {
            var state = presenter.getState();
            if (state == TS.MVP.PresenterState.Initialized) {
                // start it
                presenter.start();
            }
        }

        public _stop(presenter: TS.MVP.IPresenter) {
            var state = presenter.getState();
            if (state == TS.MVP.PresenterState.Started) {
                presenter.stop();
            }
        }

        public _destroy(presenter: TS.MVP.IPresenter) {
            var state = presenter.getState();
            if (state == TS.MVP.PresenterState.Initialized) {
                presenter.destroy();
            }
        }

        public _handleModelChangeEvent(event: TS.MVP.ModelChangeEvent) {
            var model = this.getModel();
            var description: TS.MVP.List.ListPresenterModelChangeDescription = <any>event.lookupExclusive(TS.MVP.List.ListPresenterModelChangeDescription.CHANGE_TYPE_LIST_ITEMS_CHANGE);
            if( description ) {
                var previousItemCount = description.previousItemCount;
                var appendedRowCount = description.appendedRowCount;
                for( var i in description.removedRows ) {
                    var removedRow = description.removedRows[i];
                    var item = this._positionsToListItems[removedRow];
                    if( item != null ) {
                        // move everything else down
                        var index = removedRow;
                        this._clearListItem(item);
                        while( index < previousItemCount ) {
                            var next = this._positionsToListItems[index+1];
                            if( next ) {
                                this._positionsToListItems[index] = next;
                            } else {
                                delete this._positionsToListItems[index];
                            }
                            index++;
                        }
                    }
                }
                // add in any extra
                var index = previousItemCount;
                while( index < (previousItemCount + appendedRowCount) && this._keepLoading(model, index) ) {
                    this._appendItem(index);
                    index++;
                }
            } else {
                super._handleModelChangeEvent(event);
            }
        }


        public _doLoad(model: TS.MVP.List.IListPresenterModel) {


            // unload everything
            this._clear();

            // load everything for now
            var presenterCount = model.getPresenterCount();
            for (var i = 0; i < presenterCount; i++) {
                if (this._keepLoading(model, i)) {
                    this._appendItem(i);
                } else {
                    break;
                }
            }
        }

        public _keepLoading(listModel: TS.MVP.List.IListPresenterModel, position: number): boolean {
            return true;
        }

        public _appendItem(index: number) {
            var model = this.getModel();
            var container = this.$(this._listContainerSelector);
            var controllerType = model.getPresenterType(index);
            // check reusable controllers
            var reusablePresenters = this._typesToReusableControllers[controllerType];
            var reusablePresenter: TS.MVP.IPresenter;
            if (reusablePresenters != null && reusablePresenters.length > 0) {
                // note, this controller gets removed from the reuse pile regardless of whether it is actually used or not
                reusablePresenter = reusablePresenters.pop();
            } else {
                reusablePresenter = null;
            }
            var presenter = <TS.IJQuery.MVP.IJQueryPresenter>model.getPresenter(index, reusablePresenter);
            // TODO parameters to the view factory based on the controller might be useful
            var listItemContainer = this._listItemContainerViewFactory(container, null);
            listItemContainer.attach();
            this._initAndStart(presenter, listItemContainer.$);
            var item = new AbstractListJQueryPresenterItem(presenter, controllerType, listItemContainer);
            this._positionsToListItems[index] = item;
            return item;
        }

        public _doInit() {
            super._doInit();
            // hope this iterates in numeric order!
            for (var position in this._positionsToListItems) {
                var listItem = this._positionsToListItems[position];
                var containerView = listItem.getContainerView();
                containerView.attach();
                var presenter = listItem.getPresenter();
                // TODO check that the presenter initialized
                presenter.init(containerView.$);
            }
        }

        public _doStart(): boolean {

            // TODO : these controllers are probably going to be reloaded anyway, so starting them may not be much use?

            // start all controllers
            for (var position in this._positionsToListItems) {
                var listItem = this._positionsToListItems[position];
                var presenter = listItem.getPresenter();
                this._start(presenter);
            }
            return super._doStart();
        }

        public _doStop(): boolean {

            // stop all controllers
            for (var position in this._positionsToListItems) {
                var listItem = this._positionsToListItems[position];
                var presenter = listItem.getPresenter();
                this._stop(presenter);
            }
            return super._doStop();
        }

        public _doDestroy(detachView:boolean): boolean {
            // just clear it
            /*
            for (var position in this._positionsToListItems) {
                var listItem: AbstractListJQueryListItem = this._positionsToListItems[position];
                var controller = listItem.getController();
                this._destroy(controller);
                listItem.containerView.detach();
            }
            */
            this._clear();
            return super._doDestroy(detachView);

        }

        public layout(): void {
            // TODO layout subordinate controllers;
            super.layout();
        }


        public _clear() {
            // save any discarded controllers for later
            for (var position in this._positionsToListItems) {
                var listItem = this._positionsToListItems[position];
                this._clearListItem(listItem);
            }
            this._positionsToListItems = {};
        }

        public _clearListItem(listItem: AbstractListJQueryPresenterItem) {
            var presenter = listItem.getPresenter();
            this._stop(presenter);
            this._destroy(presenter);
            listItem.getContainerView().detach();
            var presenterType = listItem.getPresenterType();
            var reusablePresenters = this._typesToReusableControllers[presenterType];
            if (reusablePresenters == null) {
                reusablePresenters = [];
                this._typesToReusableControllers[presenterType] = reusablePresenters;
            }
            reusablePresenters.push(presenter);
        }

        // all list items are assumed to go into the same container!
        public _getContainer(): JQuery {
            // just use the root element
            return this._view.$;
        }

        public $(selector?: string): JQuery {
            // do a careful jquery (only owned elements)
            var roots = this._view.$;
            var rootElements = roots.toArray();
            // we inherently know that our roots are valid (no need to check lineage)
            var query;
            if (selector != null) {
                var allChildRootElements: Node[] = [];
                // initialized controllers
                for (var position in this._positionsToListItems) {
                    var listItem = this._positionsToListItems[position];
                    var view = listItem.getContainerView();
                    if (view != null) {
                        // we can get odd situations where the owner controller is initialized, but the children are not
                        var childRoots = view.$;
                        if (childRoots != null) {
                            arrayPushAll(allChildRootElements, childRoots.toArray());
                        }
                    }
                }

                // selector goes first as checking the parenthood is quite expensive
                query = jquerySelectFromRoot(roots, selector, function (index) {
                    var valid = true;
                    var e: Element = this;
                    while (e != null) {
                        
                        if (rootElements.indexOf(e) >= 0) {
                            // we're at our root, it's OK
                            break;
                        } else if (allChildRootElements.indexOf(e) >= 0) {
                            valid = false;
                            break;
                        } else {
                            e = <Element>e.parentNode;
                        }
                    }
                    return valid;
                });
            } else {
                query = roots;
            }

            return query;
        }
    }

} 