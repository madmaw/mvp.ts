window.onload = function () {

    // attach the handlebars helper
    Handlebars.registerHelper("selector", TS.JQuery.Template.HB.handlbarsSelectorHelper);

    // tab
    var tabElement = $("#tab");
    var tabPresenter = TS.JQuery.MVP.HB.Example.tabIndexPresenterCreate();
    var title = "MVP Sample";

    var getTitle = function () {
        return title;
    }

    var tabModel = tabPresenter.getModel();

    window.onresize = function () {
        tabPresenter.layout();
    };
    tabPresenter.init(tabElement);
    tabPresenter.start();
    document.title = getTitle();
// TODO
//    var historyManager = new templa.mvc.history.WebHistoryManager(tabPresenter);
//    historyManager.start();

}