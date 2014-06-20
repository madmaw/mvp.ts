
// Module
module TS.JQuery.MVP.HB.Example {

    export function basicStackPresenterFactoryCreate(asyncTemplateFactory: TS.JQuery.Template.IJQueryAsyncPathTemplateFactory, loadingPromises: JQueryPromise<any>[]): TS.MVP.IPresenter {

        var labelViewFactory = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/label.html", loadingPromises);  

        var basicStackModel = new TS.JQuery.MVP.HB.Example.BasicStack.BasicStackModel(labelViewFactory);

        //var stackViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div key='stack'></div>");
        //var stackViewFactory = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/stack.html", loadingPromises);
        var stackViewFactory = TS.JQuery.MVP.BorrowedJQueryView.viewFactoryEmpty();
        var stackController = new TS.JQuery.MVP.Composite.Stack.StackJQueryPresenter<TS.MVP.Composite.Stack.IStackPresenterModel>(stackViewFactory);
        stackController.setModel(basicStackModel);

        //.DocumentFragmentElementViewFactory("<input key='" + inputElementKey + "'></input><br/><input type='button' key='" + inputButtonKey + "' value='Submit'></input>");
        var inputViewFactory = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/input.html", loadingPromises); 
        var inputController = new TS.JQuery.MVP.HB.Example.TextInput.TextInputPresenter(inputViewFactory);
        inputController.setModel(basicStackModel);


        var idInput = "basic_input";
        var idStack = "basic_stack";
        var presenters: { [_: string]: TS.MVP.IPresenter } = {};
        presenters[idInput] = inputController;
        presenters[idStack] = stackController;
        var model = new TS.MVP.Composite.MappedKeyedCompositePresenterModel(
            presenters
        );

        var viewFactory = TS.JQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/stack_container.html", loadingPromises);
//            "<div class = '" + idInput + "' > </div><div class = '" + idStack + "' > </div>"
        var presenter = new TS.JQuery.MVP.Composite.KeyedCompositeJQueryPresenter<TS.MVP.Composite.IKeyedCompositePresenterModel>(
            viewFactory
        );
        presenter.setModel(model);
        return presenter;
    }

}