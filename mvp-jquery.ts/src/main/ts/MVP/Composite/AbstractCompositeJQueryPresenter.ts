module TS.IJQuery.MVP.Composite {

    export class AbstractCompositeJQueryPresenter<ModelType extends TS.MVP.Composite.ICompositePresenterModel> extends AbstractJQueryPresenter<ModelType> {

        public _presenters: TS.MVP.IPresenter[];

        constructor(viewFactory: TS.IJQuery.MVP.IJQueryViewFactory, private _defaultPresenterContainerSelector?:string) {
            super(viewFactory);
            this._presenters = [];
        }

        public _handleModelChangeEvent(event: TS.MVP.ModelChangeEvent) {
            var description = <TS.MVP.Composite.CompositePresenterModelChangeDescription>event.lookupExclusive(TS.MVP.Composite.CompositePresenterModelChangeDescription.COMPOSITE_PRESENTER_MODEL_CHANGED);
            if( description ) {
                // handle manually
                var removedPresenters = description.removedPresenters;
                for( var i in removedPresenters ) {
                    var removedPresenter = removedPresenters[i];
                    this._remove(removedPresenter);
                }
                var addedPresenters = description.addedPresenters;
                for( var i in addedPresenters ) {
                    var addedPresenter = addedPresenters[i];
                    this._add(<IJQueryPresenter>addedPresenter);
                }
            } else {
                super._handleModelChangeEvent(event);
            }
        }

        public _doLoad(model: TS.MVP.Composite.ICompositePresenterModel) {
            // load up the controllers
            this.clear();
            var presenters = model.getPresenters();
            for (var i in presenters) {
                var presenter = <TS.IJQuery.MVP.IJQueryPresenter>presenters[i];
                this._add(presenter, false, false);
            }
            this.layout();
        }

        public clear() {
            if (this._presenters.length > 0) {
                var state = this.getState();
                for (var i in this._presenters) {
                    var presenter = this._presenters[i];

                    // check state
                    if (state >= TS.MVP.PresenterState.Initialized) {
                        if (state >= TS.MVP.PresenterState.Started) {
                            presenter.stop();
                        }
                        presenter.destroy(true);
                    }
                }
                this._presenters = [];
            }
        }

        public _doStart(): boolean {
            var result = super._doStart();
            for (var i in this._presenters) {
                var presenter = this._presenters[i];
                result = presenter.start() || result;
            }
            return result;
        }

        public _doStop(): boolean {
            var result = super._doStop();
            for (var i in this._presenters) {
                var presenter = this._presenters[i];
                result = presenter.stop() || result;
            }
            return result;
        }

        public _doInit(): void {
            super._doInit();
            for (var i in this._presenters) {
                var presenter = <TS.IJQuery.MVP.IJQueryPresenter>this._presenters[i];
                var presenterContainer = this._getPresenterContainer(presenter);
                // TODO check that the presenter initialized
                presenter.init(presenterContainer, false);
            }
        }

        public _doDestroy(detachView: boolean): boolean {
            var result = false;
            var ownsView = (<IJQueryView>this.getView()).ownsSelf;
            for (var i in this._presenters) {
                var presenter = this._presenters[i];
                // NOTE setting detach view to false will yield some performance benefits since we will just trim the entire tree in one hit (at the parent)
                // TODO are there cases where the view heirarchy does not reflect the controller heirarchy? (I hope not)
                // NOTE, it only works if we actually own the underlying view, hence the check here
                result = presenter.destroy(!ownsView && detachView) || result;
            }
            // destroy our view at the end, otherwise the children cannot remove themselves from an empty view
            result = super._doDestroy(detachView) || result;
            return result;
        }

        public _add(presenter: TS.IJQuery.MVP.IJQueryPresenter, layout?: boolean, prepend?: boolean) {
            this._presenters.push(presenter);

            var container = this._getPresenterContainer(presenter);
            if (container == null) {
                throw "no container!";
            }
            var state: number = this.getState();
            if (state >= TS.MVP.PresenterState.Initialized) {
                presenter.init(container, prepend);
                if (state >= TS.MVP.PresenterState.Started) {
                    presenter.start();
                }
            }
            if (layout != false) {
                this.layout();
            }
        }

        public _remove(presenter: TS.MVP.IPresenter, detachView?: boolean, layout?: boolean) {
            var removed: boolean = TS.arrayRemoveElement(this._presenters, presenter);
            if (removed) {
                var state: number = this.getState();
                if (state >= TS.MVP.PresenterState.Initialized) {
                    if (state >= TS.MVP.PresenterState.Started) {
                        presenter.stop();
                    }
                    presenter.destroy(detachView);
                }
                if (layout != false) {
                    this.layout();
                }
            }
        }


        public layout(): void {
            super.layout();
            // layout the children
            for (var i in this._presenters) {
                var presenter = this._presenters[i];
                presenter.layout();
            }
        }



        public $(selector?: string): JQuery {
            // do a careful jquery (only owned elements)
            var root = this._view.$;
            var rootElements = root.toArray();
            var allChildRootElements: Element[] = [];
            for (var i in this._presenters) {
                var presenter = this._presenters[i];
                var view = <IJQueryView>presenter.getView();
                if (view != null) {
                    // we can get odd situations where the owner controller is initialized, but the children are not
                    var childRoot = view.$;
                    if (childRoot != null) {
                        arrayPushAll(allChildRootElements, childRoot.toArray());
                    }
                }
            }
            return jquerySelectFromRoot(root, selector, function (index) {
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
        }

        public _getPresenterContainer(presenter: TS.MVP.IPresenter): JQuery {
            var selector = this._getPresenterContainerSelector(presenter);
            var result: JQuery;
            if (selector == null) {
                result = this._view.$;
            } else {
                result = this.$(selector);
            }
            if (result.length == 0) {
                throw "no container for selector " + selector;
            }
            return result;
        }

        public _getPresenterContainerSelector(presenter: TS.MVP.IPresenter): string {
            return this._defaultPresenterContainerSelector;
        }


    }

} 