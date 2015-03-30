module TS.IJQuery.Template.XSLT {

    export function xsltSupportsStandard(): boolean {
        return !!window["DOMParser"] && !!window["XSLTProcessor"];
    }

    export function xsltJQueryAsyncPathTemplateFactory(properties?: { [_: string]: any }): IJQueryAsyncPathTemplateFactory {
        // assemble the imports ourselves to get around Google loading issues (do for everyone so the service is consistent)
        return function <T>(path: string): JQueryPromise<IJQueryTemplate<T>> {
            var deferred = new jQuery.Deferred();
            xmlRead(
                path,
                function (node:Node) {
                    xsltRewriteIncludes(
                        path,
                        node,
                        {},
                        {},
                        function() {
                            // use the node for the template
                            var template;
                            // merge in the extra properties

                            if( xsltSupportsStandard() ) {
                                template = standardXsltJQueryNodeTemplate(node, properties);
                            } else {
                                // treat as a string
                                var templateString: string;
                                if( typeof XMLSerializer == 'function' ) {
                                    var serializer = new XMLSerializer();
                                    templateString = serializer.serializeToString(node);
                                } else {
                                    templateString = node['xml'];
                                }
                                /*
                                var tmp = document.createElement("div");
                                tmp.appendChild(node);
                                var templateString = tmp.innerHTML;
                                */
                                template = msXSLTJQueryStringTemplateFactory(properties)(templateString);
                            }
                            deferred.resolve(template);
                        },
                        function(e:any) {
                            deferred.reject(e);
                        }
                    )
                },
                function (e:any) {
                    deferred.reject(e);
                }

            );
            return deferred.promise();
        };
    }

    export function xsltRewriteIncludes(path:string, node: Node, imported: { [_: string]: boolean }, params: {[_:string]: boolean }, onRewritten:()=>void, onFailure:(e:any)=>void): boolean {
        var result;
        var element = <Element>node;
        if( element == null ) {
            throw "unable to load path ("+path+")";
        }
        var paramNodes = element.querySelectorAll("param");
        for( var i=0; i<paramNodes.length; i++ ) {
            var paramNode = <Element>paramNodes.item(i);
            var name = paramNode.getAttribute("name");
            params[name] = true;
        }
        var importNodes = element.querySelectorAll("import,include");
        if (importNodes.length == 0) {
            onRewritten();
            result = false;
        } else {
            var rewrittenNodes = 0;
            // load imports
            var nodeCount = importNodes.length;
            for (var i = 0; i < importNodes.length; i++) {
                var importElement = <Element>importNodes.item(i);
                var href = importElement.getAttribute("href");
                // work out relative path
                var relativePath = TS.pathAppendRelative(path, href);

                if (!imported[relativePath]) {
                    var f = function(e: Element) {
                        imported[relativePath] = true;
                        TS.xmlRead(relativePath, (importedStylesheet: Node) => {
                            xsltRewriteIncludes(relativePath, importedStylesheet, imported, params, function () {
                                // replace the import with this node (minus stylesheet container)
                                for (var j = 0; j < importedStylesheet.firstChild.childNodes.length; j++) {
                                    var templateNode = <Element>importedStylesheet.firstChild.childNodes.item(j);
                                    if (templateNode.nodeName.indexOf("template") >= 0 || templateNode.nodeName.indexOf("param") >= 0 && !params[templateNode.getAttribute("name")]) {
                                        e.parentNode.insertBefore(templateNode, e);
                                    }
                                }
                                e.parentNode.removeChild(e);
                                rewrittenNodes++;
                                if (rewrittenNodes == nodeCount) {
                                    if (onRewritten) {
                                        onRewritten();
                                    }
                                }
                            }, onFailure);
                        }, onFailure);
                    };
                    f(importElement);
                } else {
                    importElement.parentNode.removeChild(importElement);
                    nodeCount--;
                    if( nodeCount == 0 ) {
                        if (onRewritten) {
                            onRewritten();
                        }
                    }
                }
            }
            result = true;
        }
        return result;
    }

    export function standardXsltJQueryNodeTemplate<T>(node: Node, properties: { [_: string]: any } = {}, domParser: DOMParser = new DOMParser(), mimeType: string= "text/xml"): IJQueryTemplate<T> {
        var processor = new XSLTProcessor();
        processor.importStylesheet(node);
        for (var key in properties) {
            var value = properties[key];
            processor.setParameter(null, key, value);
        }
        return function (t: T): JQuery {
            var xmlString = xmlFrom(t);
            if (xmlString == null) {
                xmlString = "<null/>";
            }
            var xml = domParser.parseFromString(xmlString, mimeType);
            var fragment = processor.transformToFragment(xml, document);
            // return the child nodes, not the fragment (which isn't a physical node)
            return $(fragment.childNodes);
        }
    }

    export function xsltJQueryStringTemplateFactory(properties?: { [_: string]: any }): IJQueryStringTemplateFactory {
        // check for MS oddities
        if (xsltSupportsStandard()) {
            return standardXSLTJQueryStringTemplateFactory(properties);
        } else {
            return msXSLTJQueryStringTemplateFactory(properties);
        }
    }

    export function standardXSLTJQueryStringTemplateFactory(properties: { [_: string]: any } = {}, mimeType: string= "text/xml"): IJQueryStringTemplateFactory {
        var domParser = new DOMParser();
        return function <T>(template: string): IJQueryTemplate<T> {
            var node = domParser.parseFromString(template, mimeType);
            return standardXsltJQueryNodeTemplate(node, properties, domParser, mimeType);
        }
    }

    export function msXSLTJQueryStringTemplateFactory(properties: { [_: string]: any } = {}): IJQueryStringTemplateFactory {
        return function <T>(templateString: string): IJQueryTemplate<T> {
            var xslDocument = <Msxml2.FreeThreadedDOMDocument>new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
            xslDocument.async = "false";
            xslDocument.loadXML(templateString);
            var template = <Msxml2.XSLTemplate>new ActiveXObject("Msxml2.XSLTemplate");

            template.stylesheet = xslDocument;
            return function (t: T): JQuery {
                var xmlDocument = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
                xmlDocument.async = "false";
                var xmlString = xmlFrom(t);
                if( xmlString == null ) {
                    // just make one up
                    xmlString = "<temp></temp>";
                }
                xmlDocument.loadXML(xmlString);
                var processor = template.createProcessor();
                for( var key in properties ) {
                    var value = properties[key];
                    processor.addParameter(key, value);
                }
                processor.input = xmlDocument;
                processor.transform();
                var html = processor.output;
                return $($.parseHTML(html));
            }
        }
    }

    

} 