module TS {
    export function mapMerge(properties: {[_:string]: any}, extraProperties: {[_:string]: any}) {
        var allProperties: {[_:string]: any};
        if( extraProperties ) {
            allProperties = {};
            for( var key in properties ) {
                var value = properties[key];
                allProperties[key] = value;
            }
            for( var key in extraProperties ) {
                var value = extraProperties[key];
                allProperties[key] = value;
            }
        } else {
            allProperties = properties;
        }
        return allProperties;
    }
}