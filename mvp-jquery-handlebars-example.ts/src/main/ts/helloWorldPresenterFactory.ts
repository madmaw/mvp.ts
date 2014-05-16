// Module  
module TS.JQuery.MVP.HB.Example {
    
    export function helloWorldPresenterFactoryCreate(asyncTemplateFactory: TS.JQuery.Template.IJQueryAsyncPathTemplateFactory, loadingPromises: JQueryPromise<any>[]): TS.MVP.IPresenter {
        //var labelViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div>Hello <span key='name_element'></span>!</div>");
        var labelViewFactory = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/label.html", loadingPromises);
        var labelPresenter = new TS.JQuery.MVP.HB.Example.Label.LabelPresenter(labelViewFactory);
        var labelModel = new TS.JQuery.MVP.HB.Example.HelloWorld.HelloWorldModel("World");
        labelPresenter.setModel(labelModel);

        return labelPresenter;
    }

}

