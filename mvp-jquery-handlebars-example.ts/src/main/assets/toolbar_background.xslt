<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/2000/svg">

    <xsl:param name="toolbar_width"/>
    <xsl:param name="toolbar_height"/>
    <xsl:param name="toolbar_background_color"/>
    <xsl:param name="toolbar_dark_color"/>
    <xsl:param name="toolbar_dark_width"/>
    <xsl:param name="toolbar_shadow_width"/>
    <xsl:param name="toolbar_shadow_color"/>


    <xsl:template match="/">

        <svg width="{$toolbar_width}" height="{$toolbar_height}" viewBox="0 0 {$toolbar_width} {$toolbar_height}">

            <g>
                <defs>
                    <filter id="ShadowFilter" filterUnits="userSpaceOnUse" x="{-$toolbar_width}" y="0" width="{$toolbar_width * 3}" height="{$toolbar_height}">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="{$toolbar_shadow_width div 2}" result="shadow_blur"/>
                        <feMerge>
                            <feMergeNode in="shadow_blur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <linearGradient id="background" x1="0" y1="0" x2="0" y2="100%" gradientUnits="objectBoundingBox">
                        <stop offset="0%" stop-color="{$toolbar_background_color}"/>
                        <stop offset="{($toolbar_height - $toolbar_shadow_width - $toolbar_dark_width) * 100 div ($toolbar_height - $toolbar_shadow_width)}%" stop-color="{$toolbar_background_color}"/>
                        <stop offset="100%" stop-color="{$toolbar_dark_color}"/>
                    </linearGradient>
                </defs>
                <rect
                        fill="url(#background)"
                        stroke="none"
                        x="{-$toolbar_width}"
                        y="0"
                        width="{$toolbar_width * 3}"
                        height="{$toolbar_height - $toolbar_shadow_width}"
                        filter="url(#ShadowFilter)">
                </rect>
            </g>
        </svg>

    </xsl:template>

</xsl:stylesheet>