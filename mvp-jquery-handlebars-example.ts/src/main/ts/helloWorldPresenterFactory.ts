// Module  
module TS.IJQuery.MVP.HB.Example {
    
    export function helloWorldPresenterFactoryCreate(asyncTemplateFactory: TS.IJQuery.Template.IJQueryAsyncPathTemplateFactory, loadingPromises: JQueryPromise<any>[]): TS.MVP.IPresenter {
        //var labelViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div>Hello <span key='name_element'></span>!</div>");
        var labelViewFactory = TS.IJQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/label.html", loadingPromises);
        var labelPresenter = new TS.IJQuery.MVP.HB.Example.Label.LabelPresenter(labelViewFactory);
        var labelModel = new TS.IJQuery.MVP.HB.Example.HelloWorld.HelloWorldModel("World");
        labelPresenter.setModel(labelModel);

        return labelPresenter;
    }

}

