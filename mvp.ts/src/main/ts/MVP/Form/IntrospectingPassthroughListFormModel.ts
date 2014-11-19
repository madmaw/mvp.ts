module TS.MVP.Form {
    export class IntrospectingPassthroughListFormModel<ElementType, SourceValueType>
        extends TS.MVP.List.AbstractListPresenterModel
        implements TS.MVP.Form.IListFormModel<ElementType[], SourceValueType>{

        public _sourceValue: SourceValueType;
        public _sourceError: IFormError;
        public _modified: boolean;
        private _showErrors: boolean;
        public _completionListener: ()=> void;

        constructor(private _key: string,
                    private _presenterFactories:{[_:string]: (element?: ElementType) => TS.MVP.IPresenterWithModel<TS.MVP.Form.IFormModel<any, ElementType>> }
        ) {
            super();
        }

        public setSourceValue(sourceValue: SourceValueType, notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            // set or create the children as required
            // stop listening for changes on any existing presenters
            this._sourceValue = sourceValue;
            var value = this.getValue();
            var presenters: IPresenterWithModel<IFormModel<any, ElementType>>[] = [];
            for( var i in value ) {
                var element = value[i];
                var presenterType = this._getPresenterType(element);
                var presenterFactory = this._presenterFactories[presenterType];
                var presenter = presenterFactory(element);
                presenters.push(presenter);
            }
            this._modified = this._modified || !notModified;
            this.setPresenters(presenters, suppressModelChangeEvent, suppressStateChangeEvent);
        }

        protected _getPresenterType(element: ElementType) {
            for( var key in this._presenterFactories ) {
                return key;
            }
            return null;
        }

        public getValue() {
            return <ElementType[]>this._sourceValue[this._key];
        }

        public setValue(value: ElementType[], notModified?: boolean, suppressModelChangeEvent?: boolean, suppressStateChangeEvent?: boolean) {
            // note: we don't update the presenters here, must be done manually
            this._sourceValue[this._key] = value;
            this._modified = this._modified || !notModified;
            if( !suppressModelChangeEvent ) {
                this._fireModelChangeEvent(null, suppressStateChangeEvent);
            }
            //this.setSourceValue(<SourceValueType><any>value, notModified, suppressModelChangeEvent, suppressStateChangeEvent);
        }

        clear(): void {
            this._sourceError = null;
            this._showErrors = false;
            for( var i in this._presenters ) {
                var presenter = this._presenters[i];
                var model = (<IPresenterWithModel<IFormModel<any, ElementType>>>presenter).getModel();
                model.clear();
            }
            this._modified = false;
            // TODO indicate that it's the validation errors that have changed (only)
            this._fireModelChangeEvent(null, true);
        }

        setSourceError(sourceError: IFormError, forceShow?:boolean) {
            this._sourceError = sourceError;
            this._showErrors = forceShow;
            var error = this.getError();
            for( var i in this._presenters ) {
                var childError;
                if( error && error.children ) {
                    childError = error.children[i];
                } else {
                    childError = null;
                }
                var presenter = this._presenters[i];
                var model = (<IPresenterWithModel<IFormModel<any, ElementType>>>presenter).getModel();
                model.setSourceError(childError, forceShow);
            }
            // TODO indicate that it's the validation errors that have changed (only) - this reloads the entire page!
            this._fireModelChangeEvent(new FormModelErrorChangeDescription(this.getErrors()), true);
        }

        getError(): IFormError {
            var result;
            if( this._sourceError && this._sourceError.children ) {
                result = this._sourceError.children[this._key];
            } else {
                result = null;
            }
            return result;
        }

        getErrors(): string[] {
            var result;
            var error = this.getError();
            if( error != null && (this._modified || this._showErrors) ) {
                result = error.errors;
            } else {
                result = null;
            }
            return result;
        }

        exportState() {
            return this.getValue();
        }

        isModified() {
            return this._modified;
        }

        requestFocus() {
            // focus on the first, if it exists
            if( this._presenters && this._presenters.length > 0 ) {
                var first: IPresenterWithModel<IFormModel<any, ElementType>> = <any>this._presenters[0];
                var firstModel = first.getModel();
                firstModel.requestFocus();
            }
        }

        setCompletionListener(completionListener: ()=>void) {
            this._completionListener = completionListener;
        }

        requestComplete() {
            if( this._completionListener ) {
                this._completionListener();
            }
        }

        requestAddRow(type: string): void {
            var presenterFactory = this._presenterFactories[type];
            var presenter = presenterFactory();
            var property = presenter.getModel().getValue();
            var presenters = this._presenters;
            // create empty property
            var value = this.getValue();
            var count: number;
            if (value == null) {
                count = 0;
                value = [property];
                presenters = [presenter];
            } else {
                count = value.length;
                value.push(property);
                presenters.push(presenter);
            }
            // add the presenter
            this.setPresenters(presenters, true, true);
            // we suppress the events, and ...
            this.setValue(value, false, true, true);
            // ...fire specialized event
            var description = new TS.MVP.List.ListPresenterModelChangeDescription([], 1, count);
            this._fireModelChangeEvent(description);
        }

        requestRemoveRow(index: number): void {
            var value = this.getValue();
            var count = value.length;
            var presenters = this._presenters;
            presenters.splice(index, 1);
            value.splice(index, 1);
            // remove the presenter
            this.setPresenters(presenters, true, true);
            // we suppress the events (technically this "set" probably isn't neccessary), and ...
            this.setValue(value, false, true, true);
            // ...fire specialized event
            var description = new TS.MVP.List.ListPresenterModelChangeDescription([index], 0, count);
            this._fireModelChangeEvent(description);
        }
    }
}