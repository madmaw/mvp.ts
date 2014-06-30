module TS.IJQuery.MVP.Table {


    export class AbstractTableJQueryPresenter<ModelType extends TS.MVP.Table.ITablePresenterModel> extends TS.IJQuery.MVP.AbstractJQueryPresenter<ModelType> {

        private _rowHeaders: AbstractTableJQueryPresenterCell[];
        private _leafRowHeaders: AbstractTableJQueryPresenterCell[];
        private _columnHeaders: AbstractTableJQueryPresenterCell[];
        private _leafColumnHeaders: AbstractTableJQueryPresenterCell[];
        private _cells: AbstractTableJQueryPresenterCell[][];
        private _rowCount: number;
        private _columnCount: number;

        private _rowHeaderView: IJQueryView;
        private _columnHeaderView: IJQueryView;
        private _tableView: IJQueryView;

        constructor(
            viewFactory: IJQueryViewFactory,
            private _rowHeaderViewFactory: (container: JQuery, rows: number, depth:number) => IJQueryView,
            private _rowSelectorFormat: string,
            private _columnHeaderViewFactory: (container: JQuery, columns: number, depth: number) => IJQueryView,
            private _columnSelectorFormat: string,
            private _tableViewFactory: (container: JQuery, rows: number, columns: number) => IJQueryView,
            private _cellSelectorFormat: string

        ) {
            super(viewFactory);
        }

        public _doLoad(model: TS.MVP.Table.ITablePresenterModel) {

            // remove everything

            this._removeAll();

            var rowCount = model.getRowCount();
            var columnCount = model.getColumnCount();
            var rowHeaderDepth = model.getRowHeaderDepth();
            var columnHeaderDepth = model.getColumnHeaderDepth();

            this._rowCount = rowCount;
            this._columnCount = columnCount;

            var container = this._view.$;

            // create the views
            this._rowHeaderView = this._rowHeaderViewFactory(container, rowCount, rowHeaderDepth);
            this._rowHeaderView.attach();

            this._columnHeaderView = this._columnHeaderViewFactory(container, columnCount, columnHeaderDepth);
            this._columnHeaderView.attach();

            this._tableView = this._tableViewFactory(container, rowCount, columnCount);
            this._tableView.attach();

            // create the headers
            this._columnHeaders = [];
            this._leafColumnHeaders = [];
            //var columnHeaderSelectorHandler = new templa.dom.mvc.jquery.ElementViewJQuerySelectorHandler(this._columnHeaderView);
            for (var i = 0; i < columnCount; i++) {
                for (var depth = 0; depth < columnHeaderDepth; depth++) {
                    var columnHeader = model.getColumnHeader(i, depth);
                    var columnSelector = stringFormat(this._columnSelectorFormat, [i, depth]);
                    var reference = jquerySelectFromRoot(this._columnHeaderView.$, columnSelector);
                    if (columnHeader.getFromIndex() == i) {
                        var columnHeaderPresenter = <IJQueryPresenter>columnHeader.getPresenter();
                        // set the span on cell
                        var columnSpan = columnHeader.getSpan();
                        if (columnSpan != null && columnSpan > 1) {
                            reference.attr("colspan", columnSpan);
                        }

                        var columnHeaderCell = new AbstractTableJQueryPresenterCell(
                            reference,
                            columnHeaderPresenter
                        );
                        columnHeaderPresenter.init(reference, false);
                        var view = <IJQueryView>columnHeaderPresenter.getView();
                        if (depth == columnHeaderDepth - 1) {
                            this._leafColumnHeaders.push(columnHeaderCell);
                        }
                        columnHeaderPresenter.start();
                        this._columnHeaders.push(columnHeaderCell);
                    } else {
                        // slight problem here, we want a colspan of 0, but that's not going to work, remove should do the trick
                        reference.remove();
                    }
                }
            }
            this._rowHeaders = [];
            this._leafRowHeaders = [];
            //var rowHeaderSelectorHandler = new templa.dom.mvc.jquery.ElementViewJQuerySelectorHandler(this._rowHeaderView);
            for (var i = 0; i < rowCount; i++) {
                for (var depth = 0; depth < rowHeaderDepth; depth++) {
                    var rowHeader = model.getRowHeader(i, depth);
                    var rowHeaderSelector = stringFormat(this._rowSelectorFormat, [i, depth]);
                    var reference = jquerySelectFromRoot(this._rowHeaderView.$, rowHeaderSelector);
                    if (rowHeader.getFromIndex() == i) {
                        var rowHeaderPresenter = <IJQueryPresenter>rowHeader.getPresenter();
                        // set the span on cell
                        var rowSpan = rowHeader.getSpan();
                        if (rowSpan != null && rowSpan > 1) {
                            reference.attr("rowspan", rowSpan);
                        }

                        var rowHeaderCell = new AbstractTableJQueryPresenterCell(reference, rowHeaderPresenter);

                        rowHeaderPresenter.init(reference, false);
                        var view = <IJQueryView>rowHeaderPresenter.getView();
                        if (depth == rowHeaderDepth - 1) {
                            this._leafRowHeaders.push(rowHeaderCell);
                        }
                        rowHeaderPresenter.start();
                        this._rowHeaders.push(rowHeaderCell);
                    } else {
                        // slight problem here, we want a rowspan of 0, but that's not going to work, remove should do the trick
                        reference.remove();
                    }
                }
            }
            // assign the rows and columns
            this._cells = [];
            //var tableSelectorHandler = new templa.dom.mvc.jquery.ElementViewJQuerySelectorHandler(this._tableView);
            for (var row = 0; row < rowCount; row++) {
                var columns: AbstractTableJQueryPresenterCell[] = [];
                for (var col = 0; col < columnCount; col++) {
                    var cell = <IJQueryPresenter>model.getCell(row, col);
                    var cellSelector = stringFormat(this._cellSelectorFormat, [row, col]);
                    //
                    var reference = jquerySelectFromRoot(this._tableView.$, cellSelector);
                    cell.init(reference, false);
                    var tableCell = new AbstractTableJQueryPresenterCell(reference, cell);
                    columns.push(tableCell);
                }
                this._cells.push(columns);
            }
            // make sure eveything is lined up properly
            this._layoutTable();
        }

        public _removeAll() {
            this._removeAllFromArray(this._rowHeaders);
            this._removeAllFromArray(this._columnHeaders);
            if (this._cells != null) {
                for (var i in this._cells) {
                    var row = this._cells[i];
                    this._removeAllFromArray(row);
                }
                this._cells = null;
            }
            if (this._rowHeaderView != null) {
                this._rowHeaderView.detach();
                this._rowHeaderView = null;
            }
            if (this._columnHeaderView != null) {
                this._columnHeaderView.detach();
                this._columnHeaderView = null;
            }
            if (this._tableView != null) {
                this._tableView.detach();
                this._tableView = null;
            }
        }

        public _removeAllFromArray(presenters:AbstractTableJQueryPresenterCell[]) {
            if (presenters != null) {
                for (var i in presenters) {
                    var presenter = presenters[i].presenter;
                    if (this.getState() >= TS.MVP.PresenterState.Initialized) {
                        if (this.getState() == TS.MVP.PresenterState.Started) {
                            presenter.stop();
                        }
                    }
                    presenter.destroy();
                }
            }
        }

        public layout(): void {
            // layout table controllers so everything is aligned
            super.layout();
            this._layoutTable();
        }

        public _layoutTable(): void {
            // measure everything
            var maxRowHeights: number[] = [];
            var maxColumnWidths: number[] = [];

            var rowHeaderQuery = this._rowHeaderView.$;
            var columnHeaderQuery = this._columnHeaderView.$;
            var tableQuery = this._tableView.$;
            // assume these don't interfere with eachother
            var rowHeaderWidth = rowHeaderQuery.width();
            var columnHeaderHeight = columnHeaderQuery.height();
            rowHeaderQuery.css('margin-top', columnHeaderHeight + 'px');
            columnHeaderQuery.css('margin-left', rowHeaderWidth + 'px');
            tableQuery.css('margin-top', columnHeaderHeight + 'px');
            tableQuery.css('margin-left', rowHeaderWidth + 'px');

            for (var row = 0; row < this._rowCount; row++) {
                var presenter = this._leafRowHeaders[row].presenter;
                var view = <IJQueryView>presenter.getView();
                var height = view.$.height();
                maxRowHeights.push(height);
            }
            for (var column = 0; column < this._columnCount; column++) {
                var presenter = this._leafColumnHeaders[column].presenter;
                var view = <IJQueryView>presenter.getView();
                var width = view.$.width();
                maxColumnWidths.push(width);
            }
            for (var row = 0; row < this._rowCount; row++) {
                var maxHeight = maxRowHeights[row];
                for (var column = 0; column < this._columnCount; column++) {
                    var cell = this._cells[row][column].presenter;
                    var view = <IJQueryView>cell.getView();
                    var width = view.$.width();
                    var height = view.$.height();
                    var maxWidth = maxColumnWidths[column];
                    if (height > maxHeight) {
                        maxHeight = height;
                    }
                    if (width > maxWidth) {
                        maxColumnWidths[column] = width;
                    }
                }
                maxRowHeights[row] = maxHeight;
            }
            // size em up
            // we actually want to size the container, not the contents so that subsequent calls to layout will still work
            for (var row = 0; row < this._rowCount; row++) {
                var height = maxRowHeights[row];
                var rowHeaderContainer = this._leafRowHeaders[row].container;
                rowHeaderContainer.height(height);
                for (var column = 0; column < this._columnCount; column++) {
                    var width = maxColumnWidths[column];
                    if (row == 0) {
                        var columnHeaderContainer = this._leafColumnHeaders[column].container;
                        columnHeaderContainer.width(width);
                    }
                    var maxWidth = maxColumnWidths[column];
                    var cellContainer = this._cells[row][column].container;
                    cellContainer.width(width).height(height);
                }
            }
        }

        // TODO may need to override $ method to filter out ... everything
    }
}