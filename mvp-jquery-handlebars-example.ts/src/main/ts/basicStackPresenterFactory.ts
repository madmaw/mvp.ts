
// Module
module TS.IJQuery.MVP.HB.Example {

    export function basicStackPresenterFactoryCreate(asyncTemplateFactory: TS.IJQuery.Template.IJQueryAsyncPathTemplateFactory, loadingPromises: JQueryPromise<any>[]): TS.MVP.IPresenter {

        var labelViewFactory = TS.IJQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/label.html", loadingPromises);

        var basicStackModel = new TS.IJQuery.MVP.HB.Example.BasicStack.BasicStackModel(labelViewFactory);

        //var stackViewFactory = new templa.dom.mvc.DocumentFragmentElementViewFactory("<div key='stack'></div>");
        //var stackViewFactory = TS.IJQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/stack.html", loadingPromises);
        var stackViewFactory = TS.IJQuery.MVP.BorrowedJQueryView.viewFactoryEmpty();
        var stackController = new TS.IJQuery.MVP.Composite.Stack.StackJQueryPresenter<TS.MVP.Composite.Stack.IStackPresenterModel>(stackViewFactory);
        stackController.setModel(basicStackModel);

        //.DocumentFragmentElementViewFactory("<input key='" + inputElementKey + "'></input><br/><input type='button' key='" + inputButtonKey + "' value='Submit'></input>");
        var inputViewFactory = TS.IJQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/input.html", loadingPromises);
        var inputController = new TS.IJQuery.MVP.HB.Example.TextInput.TextInputPresenter(inputViewFactory);
        inputController.setModel(basicStackModel);


        var idInput = "basic_input";
        var idStack = "basic_stack";
        var presenters: { [_: string]: TS.MVP.IPresenter } = {};
        presenters[idInput] = inputController;
        presenters[idStack] = stackController;
        var model = new TS.MVP.Composite.MappedKeyedCompositePresenterModel(
            presenters
        );

        var viewFactory = TS.IJQuery.MVP.SimpleJQueryView.viewFactoryFromTemplatePath(asyncTemplateFactory, "handlebars/stack_container.html", loadingPromises);
//            "<div class = '" + idInput + "' > </div><div class = '" + idStack + "' > </div>"
        var presenter = new TS.IJQuery.MVP.Composite.KeyedCompositeJQueryPresenter<TS.MVP.Composite.IKeyedCompositePresenterModel>(
            viewFactory
        );
        presenter.setModel(model);
        return presenter;
    }

}