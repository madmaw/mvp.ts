module TS {

    export function pathAppendRelative(originalPath: string, relativePath: string, originalPathIsDirectory?: boolean) {
        if (originalPathIsDirectory == null) {
            originalPathIsDirectory = originalPath.charAt(originalPath.length - 1) == '/';
        }
        if (!originalPathIsDirectory) {
            // remove file imediately
            var lastSlash = originalPath.lastIndexOf('/');
            if (lastSlash >= 0) {
                originalPath = originalPath.substring(0, lastSlash + 1);
            } else {
                originalPath = "";
            }
        }
        var slashIndex = relativePath.indexOf('/');
        if (slashIndex >= 0) {
            var relativeDirectory = relativePath.substring(0, slashIndex + 1);
            var relativeRemainder = relativePath.substring(slashIndex + 1);
            if (relativeDirectory == "../") {
                // trim off a directory on the original path
                if (originalPath.charAt(originalPath.length - 1) == '/') {
                    originalPath = originalPath.substring(0, originalPath.length - 1);
                }
                var dirIndex = originalPath.lastIndexOf('/');
                if (dirIndex >= 0) {
                    originalPath = originalPath.substring(0, dirIndex + 1);
                } else {
                    originalPath = "";
                }
            } else {
                // append to the original path
                if (originalPath.charAt(originalPath.length - 1) != '/') {
                    originalPath += '/';
                }
                originalPath += relativeDirectory;
            }
            pathAppendRelative(originalPath, relativeRemainder, true);
        } else {
            // append and be done
            if (originalPath.charAt(originalPath.length - 1) != '/') {
                originalPath += '/';
            }
            return originalPath + relativePath;
        }
    }

}