
// Module  
module TS.IJQuery.MVP.HB.Example {

    // Class
    export function tabIndexPresenterCreateAsync(data: any, callback: TS.MVP.IModelImportStateCallback) {

        var asyncTemplateFactory = TS.IJQuery.Template.HB.handlebarsJQueryAsyncPathTemplateFactory();

        var loadingPromises: JQueryPromise<any>[] = [];

        // create toolbar decorator

        var decoratorViewFactory = TS.IJQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(
            asyncTemplateFactory, "handlebars/decorator.html", loadingPromises
        );
        //var localFixedHeightSelectors = ["." + decoratorToolbarContainerKey, "." + tabBarKey];
        // for the height
        //decoratorViewFactory = new templa.mvc.element.jquery.DimensionSettingElementViewProxyFactory(decoratorViewFactory, "#" + decoratorBodyControllerKey, null, localFixedHeightSelectors);
        // for the width
        //decoratorViewFactory = new templa.mvc.element.jquery.DimensionSettingElementViewProxyFactory(decoratorViewFactory, null, [], null);

        var toolbarViewFactory = TS.IJQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(
            asyncTemplateFactory, "handlebars/toolbar.html", loadingPromises
            );

        var actionSelectorFactory = function (command: TS.MVP.Command.Command) {
            return ".toolbar_button";
        };
        var toolbarNormalCommandJQueryViewDescriptionFactory = TS.IJQuery.MVP.Command.CommandJQueryViewDescription.commandJQueryViewDescriptionFactoryFromTemplatePath(
            asyncTemplateFactory,
            "handlebars/toolbar_button_normal.html",
            actionSelectorFactory,
            loadingPromises
            );
        var toolbarBackCommandJQueryViewDescriptionFactory = TS.IJQuery.MVP.Command.CommandJQueryViewDescription.commandJQueryViewDescriptionFactoryFromTemplatePath(
            asyncTemplateFactory,
            "handlebars/toolbar_button_back.html",
            actionSelectorFactory,
            loadingPromises
            );

        var toolbarCommandViewDescriptionFactory = TS.IJQuery.MVP.Command.CommandJQueryViewDescription.delegatingCommandJQueryViewDescriptionFactoryFromMap(
            toolbarNormalCommandJQueryViewDescriptionFactory,
            { back: toolbarBackCommandJQueryViewDescriptionFactory }
            );

        var decoratorFactory = function (presenters: TS.MVP.IPresenter[], commandModel: TS.MVP.Command.ICommandModel = new TS.MVP.Command.SimpleCommandModel()): TS.MVP.IPresenter {
            var toolbarPresenter = new TS.IJQuery.MVP.Command.ToolbarCommandJQueryPresenter<TS.MVP.Command.ICommandModel>(
                toolbarViewFactory,
                toolbarCommandViewDescriptionFactory
                );
            toolbarPresenter.setModel(commandModel);

            var decoratorPresenter = new TS.IJQuery.MVP.Composite.KeyedCompositeJQueryPresenter<TS.MVP.Composite.IKeyedCompositePresenterModel>(
                decoratorViewFactory
            );
            decoratorPresenter.setModel(
                new TS.IJQuery.MVP.HB.Example.Toolbar.ToolbarDecoratorModel(
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
        helloWorldPresenter = decoratorFactory([helloWorldPresenter]);

        var helloYouPresenterId = "hello_you";
        var helloYouPresenter = helloYouPresenterFactoryCreate(asyncTemplateFactory, loadingPromises);
        helloYouPresenter = decoratorFactory([helloYouPresenter]);

        var basicStackPresenterId = "basic_stack";
        var basicStackPresenter = basicStackPresenterFactoryCreate(asyncTemplateFactory, loadingPromises);
        basicStackPresenter = decoratorFactory([basicStackPresenter]);

        var decoratedStackPresenterId = "decorated_stack";
        var decoratedStackPresenter = decoratedStackPresenterFactoryCreate(asyncTemplateFactory, loadingPromises, decoratorFactory);

        var tabbedPresenters: { [_: string]: TS.MVP.IPresenter; } = {};
        tabbedPresenters[helloWorldPresenterId] = helloWorldPresenter;
        tabbedPresenters[helloYouPresenterId] = helloYouPresenter;
        tabbedPresenters[basicStackPresenterId] = basicStackPresenter;
        tabbedPresenters[decoratedStackPresenterId] = decoratedStackPresenter;

        var tabBarButtonViewFactory = TS.IJQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(
            asyncTemplateFactory, "handlebars/tab_button.html", loadingPromises
            );

        var tabBarIdsToViewDescriptions: { [_: string]: TS.IJQuery.MVP.JQueryViewDescription; } = {};
        tabBarIdsToViewDescriptions[helloWorldPresenterId] = new TS.IJQuery.MVP.JQueryViewDescription(tabBarButtonViewFactory, { title: "Hello World" });
        tabBarIdsToViewDescriptions[helloYouPresenterId] = new TS.IJQuery.MVP.JQueryViewDescription(tabBarButtonViewFactory, { title: "Hello You" });
        tabBarIdsToViewDescriptions[basicStackPresenterId] = new TS.IJQuery.MVP.JQueryViewDescription(tabBarButtonViewFactory, { title: "Basic Stack" });
        tabBarIdsToViewDescriptions[decoratedStackPresenterId] = new TS.IJQuery.MVP.JQueryViewDescription(tabBarButtonViewFactory, { title: "Decorated Stack" });

        var tabBarViewDescriptionFactory = TS.IJQuery.MVP.Tab.TabBarTabJQueryViewDescription.tabBarTabJQueryViewDescriptionFactoryFromMap(
            tabBarIdsToViewDescriptions,
            ".tab_bar_button",
            ".tab_bar_button_root"
            );
        var tabBarViewFactory = TS.IJQuery.MVP.BorrowedJQueryView.viewFactoryEmpty();
        var tabBarPresenter = new TS.IJQuery.MVP.Tab.TabBarJQueryPresenter<TS.MVP.Tab.ITabBarModel>(
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

        var tabViewFactoryHorizontal = TS.IJQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(
            asyncTemplateFactory, "handlebars/tab_container_horizontal.html", loadingPromises
            );
        var tabViewFactoryVertical = TS.IJQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(
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
        var tabPresenter = new TS.IJQuery.MVP.Composite.KeyedCompositeJQueryPresenter<TS.MVP.Composite.IKeyedCompositePresenterModel>(
            tabViewFactory
            );

        tabBarPresenter.setModel(tabModel);
        tabPresenter.setModel(tabModel);

        var allLoadingPromises: JQueryPromise<TS.MVP.IPresenter> = $.when.apply($, loadingPromises).then(function () {
            // import the state
            tabModel.importState(data, callback);
            // return the presenter
            return tabPresenter;
        });
        return {
            maxProgress: loadingPromises.length,
            promise: allLoadingPromises
        };

    }

}