declare module Msxml2 {

    export class FreeThreadedDOMDocument {
        async: string;
        loadXML(xml: string);
    }

    export class XSLTemplate {
        stylesheet: FreeThreadedDOMDocument;
        createProcessor(): XSLProcessor;
    }

    export class XSLProcessor {
        input: FreeThreadedDOMDocument;
        transform(): void;
        output: string;
    }
}

