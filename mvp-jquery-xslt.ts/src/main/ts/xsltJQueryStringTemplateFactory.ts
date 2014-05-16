module TS.JQuery.Template.XSLT {

    export function xsltJQueryStringTemplateFactory(): IJQueryStringTemplateFactory {
        // check for MS oddities
        if (DOMParser && XSLTProcessor) {
            return standardXSLTJQueryStringTemplateFactory();
        } else {
            return msXSLTJQueryStringTemplateFactory();
        }
    }

    export function standardXSLTJQueryStringTemplateFactory(properties: { [_: string]: any } = {}, mimeType: string= "text/xml"): IJQueryStringTemplateFactory {
        var domParser = new DOMParser();
        return function <T>(template: string): IJQueryTemplate<T> {
            var node = domParser.parseFromString(template, mimeType);
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
                return $(fragment);
            }
        }
    }

    export function msXSLTJQueryStringTemplateFactory(): IJQueryStringTemplateFactory {
        return function <T>(templateString: string): IJQueryTemplate<T> {
            var xslDocument = <Msxml2.FreeThreadedDOMDocument>new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
            xslDocument.async = "false";
            xslDocument.loadXML(templateString);
            var template = <Msxml2.XSLTemplate>new ActiveXObject("Msxml2.XSLTemplate");
            template.stylesheet = xslDocument;
            return function (t: T): JQuery {
                var xmlString = xmlFrom(t);
                var xmlDocument = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
                xmlDocument.async = "false";
                xmlDocument.loadXML(xmlString);
                var processor = template.createProcessor();
                processor.input = xmlDocument;
                processor.transform();
                return $($.parseHTML(processor.output));
            }
        }
    }

    

} 