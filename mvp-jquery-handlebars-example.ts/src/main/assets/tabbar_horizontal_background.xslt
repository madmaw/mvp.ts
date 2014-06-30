<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/2000/svg">

    <xsl:param name="tabbar_horizontal_width"/>
    <xsl:param name="tabbar_horizontal_height"/>
    <xsl:param name="tabbar_horizontal_upper_color"/>
    <xsl:param name="tabbar_horizontal_middle_color"/>
    <xsl:param name="tabbar_horizontal_lower_color"/>
    <xsl:param name="tabbar_horizontal_etch_color"/>
    <xsl:param name="tabbar_horizontal_etch_width"/>


    <xsl:template match="/">

        <svg width="{$tabbar_horizontal_width}" height="{$tabbar_horizontal_height}" viewBox="0 0 {$tabbar_horizontal_width} {$tabbar_horizontal_height}">

            <g>
                <defs>
                    <linearGradient id="background" x1="0" y1="0" x2="0" y2="100%" gradientUnits="objectBoundingBox">
                        <stop offset="0%" stop-color="{$tabbar_horizontal_upper_color}"/>
                        <stop offset="50%" stop-color="{$tabbar_horizontal_middle_color}"/>
                        <stop offset="100%" stop-color="{$tabbar_horizontal_lower_color}"/>
                    </linearGradient>
                </defs>
                <rect
                        fill="url(#background)"
                        stroke="none"
                        x="0"
                        y="0"
                        width="{$tabbar_horizontal_width}"
                        height="{$tabbar_horizontal_height}">
                </rect>
                <rect
                        fill="{$tabbar_horizontal_etch_color}"
                        stroke="none"
                        x="0"
                        y="0"
                        width="{$tabbar_horizontal_width}"
                        height="{$tabbar_horizontal_etch_width}" >
                </rect>
            </g>
        </svg>

    </xsl:template>

</xsl:stylesheet>