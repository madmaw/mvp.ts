module TS.IJQuery.MVP.HB.Example {

    export function helloYouPresenterFactoryCreate(asyncTemplateFactory:TS.IJQuery.Template.IJQueryAsyncPathTemplateFactory, loadingPromises:JQueryPromise<any>[]): TS.MVP.IPresenter {

        //var labelViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div>Hello <span key='name_element'></span>!</div>");
        var labelViewFactory = TS.IJQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/label.html", loadingPromises);
        //var textInputViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<input key='input_element'></input><br/><input type='button' key='input_button' value='Submit'></input>");
        var textInputViewFactory = TS.IJQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/input.html", loadingPromises);
        //var viewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div class = '" + idOutput + "' > </div><div class = '" + idInput + "' > </div>");
        var compositePresenterViewFactory = TS.IJQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/composite_input_output.html", loadingPromises);

        var helloYouModel = new TS.IJQuery.MVP.HB.Example.HelloYou.HelloYouModel("You");

        var inputPresenter = new TS.IJQuery.MVP.HB.Example.TextInput.TextInputPresenter(textInputViewFactory);
        inputPresenter.setModel(helloYouModel);

        var labelPresenter = new TS.IJQuery.MVP.HB.Example.Label.LabelPresenter(labelViewFactory);
        labelPresenter.setModel(helloYouModel);

        var idInput = "input";
        var idOutput = "output";
        var controllers: { [_:string]: TS.MVP.IPresenter; } = {};
        controllers[idInput] = inputPresenter;
        controllers[idOutput] = labelPresenter;
        var model = new TS.MVP.Composite.MappedKeyedCompositePresenterModel(    
            controllers
        );


        var keyMaps: { [_: string]: string; } = {};
        keyMaps[idInput] = ".helloyou_input";
        keyMaps[idOutput] = ".helloyou_output";
        var controller = new TS.IJQuery.MVP.Composite.KeyedCompositeJQueryPresenter<TS.MVP.Composite.IKeyedCompositePresenterModel>(
            compositePresenterViewFactory,
            keyMaps
        );
        controller.setModel(model);
        return controller;
    }

}