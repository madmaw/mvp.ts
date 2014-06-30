<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/2000/svg">

    <xsl:param name="tabbar_vertical_width"/>
    <xsl:param name="tabbar_vertical_height"/>
    <xsl:param name="tabbar_vertical_color"/>


    <xsl:template match="/">

        <svg width="{$tabbar_vertical_width}" height="{$tabbar_vertical_height}" viewBox="0 0 {$tabbar_vertical_width} {$tabbar_vertical_height}">

            <g>
                <rect
                        fill="{$tabbar_vertical_color}"
                        stroke="none"
                        x="0"
                        y="0"
                        width="{$tabbar_vertical_width}"
                        height="{$tabbar_vertical_height}">
                </rect>
            </g>
        </svg>

    </xsl:template>

</xsl:stylesheet>