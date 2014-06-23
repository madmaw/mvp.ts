module TS {

    export function cookieSet(key: string, value: string, expiryOffsetMillis?: number) {
        var cookie = key + "=" + window.location.hash;
        if (expiryOffsetMillis) {
            var expires = new Date();
            expires = new Date(expires.getTime() + expiryOffsetMillis);
            cookie += "; expires=" + expires.toUTCString();
        }
        document.cookie = cookie;
    }

    export function cookieGet(toFind: string) {
        var cookies = document.cookie.split(";");
        for (var i in cookies) {
            var cookie = cookies[i];
            var x = cookie.indexOf("=");
            var key = cookie.substr(0, x).replace(/^\s+|\s+$/g, "");
            if (toFind == key) {
                var value = cookie.substr(x + 1);
                return decodeURI(value);
            }
        }
        return null;
    }

} 