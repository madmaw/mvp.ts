// Module
module TS.JQuery.MVP.Composite.Stack {

    export class StackJQueryPresenter<ModelType extends TS.MVP.Composite.Stack.IStackPresenterModel> extends AbstractCompositeJQueryPresenter<ModelType> {

        private removedAnimatedChildren: TS.MVP.IPresenter[];

        constructor(
            viewFactory: TS.JQuery.MVP.IJQueryViewFactory,
            private _animationFactoryBundles: StackJQueryPresenterAnimationFactoryBundle[]=[]
        ) {
            super(viewFactory);
            this.removedAnimatedChildren = [];
        }

        public setAnimationFactoryBundles(animationFactoryBundles: StackJQueryPresenterAnimationFactoryBundle[]) {
            this._animationFactoryBundles = animationFactoryBundles;
        }

        public _handleModelChangeEvent(event: TS.MVP.ModelChangeEvent) {
            var pushed: boolean;
            var stackChangeDescription = event.lookup(TS.MVP.Composite.Stack.stackPresenterModelEventTypePushed);
            if (stackChangeDescription == null) {
                stackChangeDescription = event.lookup(TS.MVP.Composite.Stack.stackPresenterModelEventTypePopped);
                pushed = false;
            } else {
                pushed = true;
            }
            if (stackChangeDescription != null) {
                var stackDescription: TS.MVP.Composite.Stack.StackPresenterModelChangeDescription = stackChangeDescription;

                // remove all the silent ones (if any)
                var silentRemovedPresenters = stackDescription.getSilentRemovedPresenters();
                if (silentRemovedPresenters != null) {
                    for (var i in silentRemovedPresenters) {
                        var silentRemovedController = silentRemovedPresenters[i];
                        this._remove(silentRemovedController, true, false);
                    }
                }
                // add all the silent ones (if any)
                var silentAddedPresenters = stackDescription.getSilentAddedPresenters();
                if (silentAddedPresenters != null) {
                    for (var i in silentAddedPresenters) {
                        var silentAddedPresenter = silentAddedPresenters[i];
                        this._add(<IJQueryPresenter>silentAddedPresenter, false, false);
                    }
                }

                var animationFactoryName: string;

                if (pushed) {
                    animationFactoryName = "pushAnimationFactory";
                } else {
                    animationFactoryName = "popAnimationFactory";
                }

                var hiddenPresenter = stackDescription.getRemovedPresenter();
                var hiddenView: IJQueryView;
                if (hiddenPresenter != null) {
                    var maxState: TS.MVP.PresenterState;
                    if (this.getState() >= TS.MVP.PresenterState.Initialized) {
                        maxState = TS.MVP.PresenterState.Initialized;
                        hiddenView = <any>hiddenPresenter.getView();
                        /*
                        var roots: Node[] = hiddenView.getRoots();
                        for (var i in roots) {
                            var root = roots[i];
                            var animation = removeAnimationFactory.create(<any>container, <any>root);
                            animation.addAnimationListener((source: templa.animation.IAnimation, event: templa.animation.AnimationStateChangeEvent) => {
                                if (event.animationState == templa.animation.animationStateFinished) {
                                    hiddenView.detach();
                                }
                            });
                            this._addAnimation(animation, false);
                        }
                        */
                    } else {
                        maxState = null;
                        hiddenView = null;
                    }
                    this._remove(hiddenPresenter, hiddenView == null);
                }

                var addedPresenter = <IJQueryPresenter>stackDescription.getAddedPresenter();
                if (addedPresenter != null) {

                    this._add(addedPresenter, true, !pushed);
                    var pushedView: IJQueryView = <any>addedPresenter.getView();
                    /*
                    var roots: Node[] = pushedView.getRoots();
                    for (var i in roots) {
                        var root = roots[i];
                        var animation = addAnimationFactory.create(<any>container, <any>root);
                        // add it to the controller so it can manage its own animations
                        pushedController.addAnimation(animation);
                    }
                        */
                }
                var animated;
                if (addedPresenter != null || hiddenPresenter != null) {
                    var animationListener;
                    if (hiddenView != null) {
                        animationListener = (source: TS.Animation.IAnimation, event: TS.Animation.AnimationStateChangeEvent) => {
                            if (event.getAnimationState() == TS.Animation.AnimationState.Finished) {
                                hiddenView.detach();
                            }
                        }
                    } else {
                        animationListener = null;
                    }
                    animated = this._animate(
                        animationFactoryName,
                        animationListener
                        );
                } else {
                    animated = false;
                }
                if (!animated && hiddenView != null) {
                    // remove immediately
                    hiddenView.detach();
                }
                this.layout();

            } else {
                super._handleModelChangeEvent(event);
            }
        }

        public _back() {
            var stackPresenterModel = <TS.MVP.Composite.Stack.IStackPresenterModel>this._model;
            stackPresenterModel.requestPop();
        }

        private _animate(animationFactoryName: string, animationCompletionListener?: (source: TS.Animation.IAnimation, event: TS.Animation.AnimationStateChangeEvent) => void): boolean {
            var result: boolean = false;

            var count = 0;
            var completionCount = 0;

            var jquery = this._view.$;
            for (var i in this._animationFactoryBundles) {
                var animationFactoryBundle: StackJQueryPresenterAnimationFactoryBundle = this._animationFactoryBundles[i];
                var animationFactory = <TS.JQuery.Animation.IJQueryAnimationFactory>animationFactoryBundle[animationFactoryName];
                if (animationFactory != null) {
                    var selector = animationFactoryBundle.selector;
                    if (selector != null) {
                        var self: JQuery = jquery.filter(selector);
                        jquery = jquery.find(selector).add(self);
                    }
                    // TODO work out which element has a root
                    var containerRoot = this._view.$;
                    for (var j = 0; j < jquery.length; j++) {
                        var animation = animationFactory(containerRoot, jquery);
                        count++;
                        result = true;
                        if (animationCompletionListener != null) {
                            // aggregate all the animation completions into one callback
                            animation.addAnimationListener(
                                function (source: TS.Animation.IAnimation, event: TS.Animation.AnimationStateChangeEvent) {
                                    if (event.getAnimationState() == TS.Animation.AnimationState.Finished) {
                                        completionCount++;
                                        if (completionCount == count) {
                                            animationCompletionListener(source, event);
                                        }
                                    }
                                }
                            );
                        }
                        this._addAnimation(animation, false);
                    }
                }
            }
            if (count == 0 && animationCompletionListener != null) {
                // animation is complete now
                animationCompletionListener(null, new TS.Animation.AnimationStateChangeEvent(TS.Animation.AnimationState.Finished));
            }
            return result;
        }
    }
}