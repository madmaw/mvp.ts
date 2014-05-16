
module TS.MVP.Table {

    export class TableHeaderTree {

        public static populate(headerTrees: TableHeaderTree[], tableHeaders?: TableHeader[][], depthOffset?: number, breadthOffset?: number): TableHeader[][] {
            if (tableHeaders == null) {
                var maxDepth = 0;
                var totalBreadth = 0;
                for (var i in headerTrees) {
                    var headerTree:TableHeaderTree = headerTrees[i];
                    var depth = headerTree.getDepth();
                    var breadth = headerTree.getBreadth();
                    if (depth > maxDepth) {
                        maxDepth = depth;
                    }
                    totalBreadth += breadth;
                }
                tableHeaders = arrayCreate2DArray(totalBreadth, maxDepth);
            }
            if (depthOffset == null) {
                depthOffset = 0;
            }
            if (breadthOffset == null) {
                breadthOffset = 0;
            }
            var index = breadthOffset;
            for (var i in headerTrees) {
                var headerTree: TableHeaderTree = headerTrees[i];
                headerTree.populateTableHeaders(tableHeaders, depthOffset, index);
                var headerTreeBreadth = headerTree.getBreadth();
                index += headerTreeBreadth;
            }
            return tableHeaders;
        }

        constructor(private _presenter: IPresenter, private _children?: TableHeaderTree[]) {
        }

        public getDepth(): number {
            var result = 1;
            if (this._children != null) {
                // get max depth
                var maxDepth = 0;
                for (var i in this._children) {
                    var child: TableHeaderTree = this._children[i];
                    var childDepth = child.getDepth();
                    if (childDepth > maxDepth) {
                        maxDepth = childDepth;
                    }
                }
                result += maxDepth;
            }
            return result;
        }

        public getBreadth(): number {
            var result;
            if (this._children != null) {
                result = 0;
                for (var i in this._children) {
                    var child: TableHeaderTree = this._children[i];
                    result += child.getBreadth();
                }
            } else {
                result = 1;
            }
            return result;
        }

        public populateTableHeaders(tableHeaders: TableHeader[][], depthOffset: number, breadthOffset: number) {
            var breadth = this.getBreadth();
            var tableHeader = new TableHeader(this._presenter, breadthOffset, breadth);
            for (var i = 0; i < breadth; i++) {
                tableHeaders[i + breadthOffset][depthOffset] = tableHeader;
            }
            if (this._children != null) {
                TableHeaderTree.populate(this._children, tableHeaders, depthOffset + 1, breadthOffset);
            }
        }
        
    }

}