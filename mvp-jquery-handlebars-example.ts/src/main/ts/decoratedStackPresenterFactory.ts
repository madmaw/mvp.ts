
// Module  
module TS.JQuery.MVP.HB.Example { 

    // Class
    export function decoratedStackPresenterFactoryCreate(
        asyncTemplateFactory: TS.JQuery.Template.IJQueryAsyncPathTemplateFactory,
        loadingPromises: JQueryPromise<any>[],
        toolbarDecoratorFactory: (presenter: TS.MVP.IPresenter[], commandModel: TS.MVP.Command.ICommandModel) => TS.MVP.IPresenter
    ): TS.MVP.IPresenter {
        // TODO should probably replace this with a JQuery animation thing, that way it will be (more) cross-platform (but not hardware accelerated)
        // create the stack controller
        //var stackViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div class='content_slider'></div>");
        //var stackViewFactory = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/stack.html", loadingPromises);
        var stackViewFactory = TS.JQuery.MVP.BorrowedJQueryView.viewFactoryEmpty();
        var animationTime = 1000;
        var relativePushAddAnimationFactory = TS.JQuery.Animation.JQueryCSSAnimation.animationFactory("animation-relative-push-add", animationTime);
        var relativePushRemoveAnimationFactory = TS.JQuery.Animation.JQueryCSSAnimation.animationFactory("animation-relative-push-remove", animationTime);
        var relativePopAddAnimationFactory = TS.JQuery.Animation.JQueryCSSAnimation.animationFactory("animation-relative-pop-add", animationTime);
        var relativePopRemoveAnimationFactory = TS.JQuery.Animation.JQueryCSSAnimation.animationFactory("animation-relative-pop-remove", animationTime);

        var absolutePushAddAnimationFactory = TS.JQuery.Animation.JQueryCSSAnimation.animationFactory("animation-absolute-push-add", animationTime);
        var absolutePushRemoveAnimationFactory = TS.JQuery.Animation.JQueryCSSAnimation.animationFactory("animation-absolute-push-remove", animationTime);
        var absolutePopAddAnimationFactory = TS.JQuery.Animation.JQueryCSSAnimation.animationFactory("animation-absolute-pop-add", animationTime);
        var absolutePopRemoveAnimationFactory = TS.JQuery.Animation.JQueryCSSAnimation.animationFactory("animation-absolute-pop-remove", animationTime);

        var stackController = new TS.JQuery.MVP.Composite.Stack.StackJQueryPresenter<TS.MVP.Composite.Stack.IStackPresenterModel>(
            stackViewFactory,
            [{
               popAnimationFactory: relativePopAddAnimationFactory,
               pushAnimationFactory: relativePushRemoveAnimationFactory,
               selector: ".decorator_content_container:nth-of-type(2)"
            }, {

               popAnimationFactory: absolutePopAddAnimationFactory,
               pushAnimationFactory: absolutePushRemoveAnimationFactory,
                selector: ".toolbar_decorator_toolbar:nth-of-type(1)"
           }, {
               popAnimationFactory: absolutePopRemoveAnimationFactory,
               pushAnimationFactory: absolutePushAddAnimationFactory,
               selector: ".toolbar_decorator_toolbar:nth-of-type(3)"
           }]
        );

        var labelViewFactory = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(
            asyncTemplateFactory,
            "handlebars/label.html",
            loadingPromises
        );

        // create the input controller
        var inputViewFactory = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(
            asyncTemplateFactory,
            "handlebars/input.html",
            loadingPromises
        );

        var stackModel = new TS.JQuery.MVP.HB.Example.DecoratedStack.DecoratedStackModel(
            stackController,
            labelViewFactory,
            inputViewFactory,
            toolbarDecoratorFactory
        );
        stackModel.requestSubmit("Hello Decorated Stack!!");
        stackController.setModel(stackModel);

        return stackController;

    }

}
