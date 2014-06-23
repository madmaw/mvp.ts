window.onload = function () {
    try {


        // attach the handlebars helper
        Handlebars.registerHelper("selector", TS.JQuery.Template.HB.handlbarsSelectorHelper);

        var stringTemplateFactory = TS.JQuery.Template.HB.handlebarsJQueryStringTemplateFactory();

        var loadingSwitcherViewFactory = TS.JQuery.MVP.BorrowedJQueryView.viewFactoryEmpty();
        var loadingSwitcherPresenter = new TS.JQuery.MVP.Composite.AbstractCompositeJQueryPresenter<TS.MVP.Composite.ICompositePresenterModel>(
            loadingSwitcherViewFactory
            );
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
            TS.JQuery.MVP.HB.Example.tabIndexPresenterCreateAsync,
            function (args: IArguments) {
                var xhr = args[0];
                var msg = <string>args[2];
                return new TS.MVP.Error.ErrorModelState(msg, xhr);
            }
            );
        loadingSwitcherPresenter.setModel(loadingSwitcherModel);


        // tab
        var tabElement = $("#tab");
        var title = "MVP Sample";

        var getTitle = function () {
            return title;
        }

        window.onresize = function () {
            loadingSwitcherPresenter.layout();
        };
        loadingSwitcherPresenter.init(tabElement);
        document.title = getTitle();
        var historyManager = new TS.History.HashHistoryManager(
            loadingSwitcherPresenter,
            rison.encode,
            rison.decode
            );
        // TODO populate the minimum history to get to the specified point
        // TODO on user refresh we don't want to populate the history

        historyManager.init(window.location, function () {
            // don't pay attention until it's done loading
            historyManager.start();
        });
        // begin loading of resources
        loadingSwitcherModel.retry();
        loadingSwitcherPresenter.start();
    } catch (e) {
        console.error(e);
    }

}