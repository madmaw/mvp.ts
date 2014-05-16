
// Module  
module TS.JQuery.MVP.HB.Example {

    // Class
    export function tabIndexPresenterCreate(): TS.JQuery.MVP.IJQueryPresenter {

        var asyncTemplateFactory = TS.JQuery.Template.HB.handlebarsJQueryAsyncPathTemplateFactory();
        var stringTemplateFactory = TS.JQuery.Template.HB.handlebarsJQueryStringTemplateFactory();

        var loadingSwitcherViewFactory = TS.JQuery.MVP.BorrowedJQueryView.viewFactoryEmpty();
        var loadingSwitcherPresenter = new TS.JQuery.MVP.Composite.AbstractCompositeJQueryPresenter<TS.MVP.Composite.ICompositePresenterModel>(
            loadingSwitcherViewFactory
        );

        function load() {
            var loadingPromises: JQueryPromise<any>[] = [];

            // create toolbar decorator

            var decoratorViewFactory = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(
                asyncTemplateFactory, "handlebars/decorator.html", loadingPromises
                );
            //var localFixedHeightSelectors = ["." + decoratorToolbarContainerKey, "." + tabBarKey];
            // for the height
            //decoratorViewFactory = new templa.mvc.element.jquery.DimensionSettingElementViewProxyFactory(decoratorViewFactory, "#" + decoratorBodyControllerKey, null, localFixedHeightSelectors);
            // for the width
            //decoratorViewFactory = new templa.mvc.element.jquery.DimensionSettingElementViewProxyFactory(decoratorViewFactory, null, [], null);

            var toolbarViewFactory = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(
                asyncTemplateFactory, "handlebars/toolbar.html", loadingPromises
                );

            var actionSelectorFactory = function (command: TS.MVP.Command.Command) {
                return ".toolbar_button";
            };
            var toolbarNormalCommandJQueryViewDescriptionFactory = TS.JQuery.MVP.Command.CommandJQueryViewDescription.commandJQueryViewDescriptionFactoryFromTemplatePath(
                asyncTemplateFactory,
                "handlebars/toolbar_button_normal.html",
                actionSelectorFactory,
                loadingPromises
                );
            var toolbarBackCommandJQueryViewDescriptionFactory = TS.JQuery.MVP.Command.CommandJQueryViewDescription.commandJQueryViewDescriptionFactoryFromTemplatePath(
                asyncTemplateFactory,
                "handlebars/toolbar_button_back.html",
                actionSelectorFactory,
                loadingPromises
                );

            var toolbarCommandViewDescriptionFactory = TS.JQuery.MVP.Command.CommandJQueryViewDescription.delegatingCommandJQueryViewDescriptionFactoryFromMap(
                toolbarNormalCommandJQueryViewDescriptionFactory,
                { back: toolbarBackCommandJQueryViewDescriptionFactory }
                );

            var decoratorFactory = function (presenters: TS.MVP.IPresenter[], commandModel: TS.MVP.Command.ICommandModel): TS.MVP.IPresenter {
                var toolbarPresenter = new TS.JQuery.MVP.Command.ToolbarCommandJQueryPresenter<TS.MVP.Command.ICommandModel>(
                    toolbarViewFactory,
                    toolbarCommandViewDescriptionFactory
                    );
                toolbarPresenter.setModel(commandModel);

                var decoratorPresenter = new TS.JQuery.MVP.Composite.KeyedCompositeJQueryPresenter<TS.MVP.Composite.IKeyedCompositePresenterModel>(
                    decoratorViewFactory
                );
                decoratorPresenter.setModel(
                    new TS.JQuery.MVP.HB.Example.Toolbar.ToolbarDecoratorModel(
                        toolbarPresenter,
                        "toolbar_decorator_toolbar",
                        presenters,
                        "toolbar_decorator_content"
                        )
                    );
                return decoratorPresenter;
            };


            // create stuff


            var helloWorldPresenterId = "hello_world";
            var helloWorldPresenter = helloWorldPresenterFactoryCreate(asyncTemplateFactory, loadingPromises);
            helloWorldPresenter = decoratorFactory([helloWorldPresenter], null);

            var helloYouPresenterId = "hello_you";
            var helloYouPresenter = helloYouPresenterFactoryCreate(asyncTemplateFactory, loadingPromises);
            helloYouPresenter = decoratorFactory([helloYouPresenter], null);

            var basicStackPresenterId = "basic_stack";
            var basicStackPresenter = basicStackPresenterFactoryCreate(asyncTemplateFactory, loadingPromises);
            basicStackPresenter = decoratorFactory([basicStackPresenter], null);

            var decoratedStackPresenterId = "decorated_stack";
            var decoratedStackPresenter = decoratedStackPresenterFactoryCreate(asyncTemplateFactory, loadingPromises, decoratorFactory);

            var tabbedPresenters: { [_: string]: TS.MVP.IPresenter; } = {};
            tabbedPresenters[helloWorldPresenterId] = helloWorldPresenter;
            tabbedPresenters[helloYouPresenterId] = helloYouPresenter;
            tabbedPresenters[basicStackPresenterId] = basicStackPresenter;
            tabbedPresenters[decoratedStackPresenterId] = decoratedStackPresenter;

            var tabBarButtonViewFactory = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(
                asyncTemplateFactory, "handlebars/tab_button.html", loadingPromises
                );

            var tabBarIdsToViewDescriptions: { [_: string]: TS.JQuery.MVP.JQueryViewDescription; } = {};
            tabBarIdsToViewDescriptions[helloWorldPresenterId] = new TS.JQuery.MVP.JQueryViewDescription(tabBarButtonViewFactory, { title: "Hello World" });
            tabBarIdsToViewDescriptions[helloYouPresenterId] = new TS.JQuery.MVP.JQueryViewDescription(tabBarButtonViewFactory, { title: "Hello You" });
            tabBarIdsToViewDescriptions[basicStackPresenterId] = new TS.JQuery.MVP.JQueryViewDescription(tabBarButtonViewFactory, { title: "Basic Stack" });
            tabBarIdsToViewDescriptions[decoratedStackPresenterId] = new TS.JQuery.MVP.JQueryViewDescription(tabBarButtonViewFactory, { title: "Decorated Stack" });

            var tabBarViewDescriptionFactory = TS.JQuery.MVP.Tab.TabBarTabJQueryViewDescription.tabBarTabJQueryViewDescriptionFactoryFromMap(
                tabBarIdsToViewDescriptions,
                ".tab_bar_button",
                ".tab_bar_button_root"
                );
            var tabBarViewFactory = TS.JQuery.MVP.BorrowedJQueryView.viewFactoryEmpty();
            var tabBarPresenter = new TS.JQuery.MVP.Tab.TabBarJQueryPresenter<TS.MVP.Tab.ITabBarModel>(
                tabBarViewFactory,
                tabBarViewDescriptionFactory,
                null,
                "selected"
                );

            var tabPaneKey = "tab_pane";
            var tabBarKey = "tab_bar";
            var tabPresenters: { [_: string]: TS.MVP.IPresenter; } = {};
            tabPresenters[tabBarKey] = tabBarPresenter;

            var tabModel = new TS.MVP.Tab.MappedKeyedCompositePresenterTabBarModel(
                helloWorldPresenterId,
                tabbedPresenters,
                tabPaneKey,
                tabPresenters
            );

            var tabViewFactoryHorizontal = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(
                asyncTemplateFactory, "handlebars/tab_container_horizontal.html", loadingPromises
                );
            var tabViewFactoryVertical = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(
                asyncTemplateFactory, "handlebars/tab_container_vertical.html", loadingPromises
                );
            /*
            var tabViewFactory = new templa.dom.mvc.ModeElementViewFactoryProxy(
                function () {
                    var result;
                    if (window.innerWidth > window.innerHeight) {
                        result = "wide";
                    } else {
                        result = "narrow";
                    }
                    return result;
                },
                <any>{
                    wide: tabViewFactoryVertical,
                    narrow: tabViewFactoryHorizontal
                }
                );
            */
            var tabViewFactory = tabViewFactoryVertical;
            var tabPresenter = new TS.JQuery.MVP.Composite.KeyedCompositeJQueryPresenter<TS.MVP.Composite.IKeyedCompositePresenterModel>(
                tabViewFactory
                );

            tabBarPresenter.setModel(tabModel);
            tabPresenter.setModel(tabModel);


            var allLoadingPromises: JQueryPromise<TS.MVP.IPresenter> = $.when.apply($, loadingPromises).then(function () {
                return tabPresenter;
            });
            return {
                maxProgress: loadingPromises.length,
                promise: allLoadingPromises
            };
        }

        var loadingViewFactory = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplateSelector(stringTemplateFactory, "#loading");
        var loadingPresenter = new TS.JQuery.MVP.Stateful.TemplatingStatefulJQueryPresenter<TS.MVP.Loading.LoadingModelState>(
            loadingViewFactory
        );

        var failureViewFactory = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplateSelector(stringTemplateFactory, "#error");
        var failurePresenter = new TS.JQuery.MVP.Stateful.TemplatingStatefulJQueryPresenter<TS.MVP.Error.ErrorModelState>(
            failureViewFactory
        );


        var loadingSwitcherModel = new TS.JQuery.MVP.Composite.JQueryPromiseSwitcherModel(
            loadingPresenter,
            failurePresenter,
            load,
            function (args: IArguments) {
                var xhr = args[0];
                var msg = <string>args[2];
                return new TS.MVP.Error.ErrorModelState(msg, xhr);
            }
        );
        loadingSwitcherModel.retry();
        loadingSwitcherPresenter.setModel(loadingSwitcherModel);

        //return tabController; 
        return loadingSwitcherPresenter;
    }

}