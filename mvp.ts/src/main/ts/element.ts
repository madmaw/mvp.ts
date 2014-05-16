// Module
module TS {

    export function elementFind(attribute: string, value: string, nodes: Node[], filter?:(o:Node)=>boolean): Element {
        var result: Element = null;
        for (var i in nodes) {
            var node: Node = nodes[i];
            if (node instanceof HTMLElement) {
                var element: HTMLElement = <HTMLElement>node;
                var attributeValue = element.getAttribute(attribute);
                if (attributeValue == value) {
                    result = <Element>node;
                    break;
                } else {
                    var children = elementGetChildren(element, filter);
                    result = elementFind(attribute, value, children, filter);
                    if (result != null) {
                        break;
                    }
                }
            }
        }
        return result;
    }

    export function elementGetChildren(container: HTMLElement, filter?: (o: Node) => boolean): Node[] {
        var collection: NodeList = container.childNodes;
        var result: Node[] = [];
        var i = 0;
        while (i < collection.length) {
            var node: Node = collection.item(i);
            if (filter == null || filter(node)) {
                result.push(node);
            }
            i++;
        }
        return result;
    }



}