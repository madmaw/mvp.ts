<xsl:stylesheet version="1.1"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink">


    <xsl:param name="toolbar_button_upper_min"/>
    <xsl:param name="toolbar_button_upper_max"/>
    <xsl:param name="toolbar_button_lower_min"/>
    <xsl:param name="toolbar_button_lower_max"/>
    <xsl:param name="toolbar_button_mid_opacity">1</xsl:param>
    <xsl:param name="toolbar_button_back"/>
    <xsl:param name="toolbar_button_forward"/>
    <xsl:param name="toolbar_button_width"/>
    <xsl:param name="toolbar_button_height"/>
    <xsl:param name="toolbar_button_rounding"/>
    <xsl:param name="toolbar_button_etch_width"/>
    <xsl:param name="toolbar_button_etch_highlight"/>
    <xsl:param name="toolbar_button_etch_shadow"/>
    <xsl:param name="toolbar_button_etch_stroke"/>

    <xsl:template match="/">

        <xsl:param name="width" select="$toolbar_button_width"/>
        <xsl:param name="height" select="$toolbar_button_height"/>

        <svg width="{$width}" height="{$height}" viewBox="0 0 {$width} {$height}">
            <g>
                <defs>
                    <linearGradient id="background-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="{$toolbar_button_upper_max}"/>
                        <stop offset="48%" stop-color="{$toolbar_button_upper_min}" stop-opacity="{$toolbar_button_mid_opacity}"/>
                        <stop offset="52%" stop-color="{$toolbar_button_lower_max}" stop-opacity="{$toolbar_button_mid_opacity}"/>
                        <stop offset="100%" stop-color="{$toolbar_button_lower_min}"/>
                    </linearGradient>
                    <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="{$toolbar_button_etch_shadow}"/>
                        <stop offset="30%" stop-color="{$toolbar_button_etch_shadow}"/>
                        <stop offset="70%" stop-color="{$toolbar_button_etch_highlight}"/>
                        <stop offset="100%" stop-color="{$toolbar_button_etch_highlight}"/>
                    </linearGradient>
                    <path id="path">
                        <xsl:attribute name="d">
                            <xsl:text>M </xsl:text>
                            <xsl:value-of select="$toolbar_button_etch_width + $toolbar_button_rounding"/>
                            <xsl:text>,</xsl:text>
                            <xsl:value-of select="$toolbar_button_etch_width"/>

                            <xsl:text> L </xsl:text>
                            <xsl:value-of select="$width - $toolbar_button_etch_width - $toolbar_button_rounding"/>
                            <xsl:text>,</xsl:text>
                            <xsl:value-of select="$toolbar_button_etch_width"/>

                            <xsl:choose>
                                <xsl:when test="toolbar_button_forward = 'true'">

                                    <xsl:text> L </xsl:text>
                                    <xsl:value-of select="$width - $toolbar_button_etch_width"/>
                                    <xsl:text>,</xsl:text>
                                    <xsl:value-of select="$height div 2"/>

                                    <xsl:text> L </xsl:text>
                                    <xsl:value-of select="$width - $toolbar_button_etch_width - $toolbar_button_rounding"/>
                                    <xsl:text>,</xsl:text>
                                    <xsl:value-of select="$height - $toolbar_button_etch_width * 2"/>

                                </xsl:when>
                                <xsl:otherwise>

                                    <xsl:text> A </xsl:text>
                                    <xsl:value-of select="$toolbar_button_rounding"/>
                                    <xsl:text>,</xsl:text>
                                    <xsl:value-of select="$toolbar_button_rounding"/>
                                    <xsl:text> 0 0,1 </xsl:text>
                                    <xsl:value-of select="$width - $toolbar_button_etch_width"/>
                                    <xsl:text>,</xsl:text>
                                    <xsl:value-of select="$toolbar_button_etch_width + $toolbar_button_rounding"/>

                                    <xsl:text> L </xsl:text>
                                    <xsl:value-of select="$width - $toolbar_button_etch_width"/>
                                    <xsl:text>, </xsl:text>
                                    <xsl:value-of select="$height - $toolbar_button_etch_width * 2 - $toolbar_button_rounding"/>

                                    <xsl:text> A </xsl:text>
                                    <xsl:value-of select="$toolbar_button_rounding"/>
                                    <xsl:text>,</xsl:text>
                                    <xsl:value-of select="$toolbar_button_rounding"/>
                                    <xsl:text> 0 0,1 </xsl:text>
                                    <xsl:value-of select="$width - $toolbar_button_etch_width - $toolbar_button_rounding"/>
                                    <xsl:text>,</xsl:text>
                                    <xsl:value-of select="$height - $toolbar_button_etch_width * 2"/>

                                </xsl:otherwise>
                            </xsl:choose>

                            <xsl:text> L </xsl:text>
                            <xsl:value-of select="$toolbar_button_etch_width + $toolbar_button_rounding"/>
                            <xsl:text>,</xsl:text>
                            <xsl:value-of select="$height - $toolbar_button_etch_width * 2"/>

                            <xsl:choose>
                                <xsl:when test="$toolbar_button_back = 'true'">

                                    <xsl:text> L </xsl:text>
                                    <xsl:value-of select="$toolbar_button_etch_width"/>
                                    <xsl:text>,</xsl:text>
                                    <xsl:value-of select="$height div 2"/>

                                    <xsl:text> L </xsl:text>
                                    <xsl:value-of select="$toolbar_button_etch_width + $toolbar_button_rounding"/>
                                    <xsl:text>,</xsl:text>
                                    <xsl:value-of select="$toolbar_button_etch_width"/>

                                </xsl:when>
                                <xsl:otherwise>

                                    <xsl:text> A </xsl:text>
                                    <xsl:value-of select="$toolbar_button_rounding"/>
                                    <xsl:text>,</xsl:text>
                                    <xsl:value-of select="$toolbar_button_rounding"/>
                                    <xsl:text> 0 0,1 </xsl:text>
                                    <xsl:value-of select="$toolbar_button_etch_width"/>
                                    <xsl:text>,</xsl:text>
                                    <xsl:value-of select="$height - $toolbar_button_etch_width * 2 - $toolbar_button_rounding"/>

                                    <xsl:text> L </xsl:text>
                                    <xsl:value-of select="$toolbar_button_etch_width"/>
                                    <xsl:text>, </xsl:text>
                                    <xsl:value-of select="$toolbar_button_etch_width + $toolbar_button_rounding"/>

                                    <xsl:text> A </xsl:text>
                                    <xsl:value-of select="$toolbar_button_rounding"/>
                                    <xsl:text>,</xsl:text>
                                    <xsl:value-of select="$toolbar_button_rounding"/>
                                    <xsl:text> 0 0,1 </xsl:text>
                                    <xsl:value-of select="$toolbar_button_etch_width + $toolbar_button_rounding"/>
                                    <xsl:text>,</xsl:text>
                                    <xsl:value-of select="$toolbar_button_etch_width"/>

                                </xsl:otherwise>
                            </xsl:choose>

                            <xsl:text> z</xsl:text>
                        </xsl:attribute>
                    </path>
                </defs>
                <clipPath id="top-half">
                    <rect x="{$toolbar_button_etch_width + 1}" y="0" width="{$width - ($toolbar_button_etch_width * 2 + 1)}" height="{$height div 2}"/>
                </clipPath>
                <clipPath id="bottom-half">
                    <rect x="0" y="{$height div 2}" width="{$width}" height="{$height div 2}"/>
                </clipPath>
                <clipPath id="all">
                    <rect x="0" y="0" width="{$width}" height="{$height}"/>
                </clipPath>
                <g clip-path="url(#all)">
                    <use
                            xlink:href="#path"
                            stroke="url(#edge-gradient)"
                            stroke-width="{$toolbar_button_etch_width}"
                            fill="none"
                            transform="translate(0,{$toolbar_button_etch_width})"
                            clip-path="url(#bottom-half)"/>
                    <use
                            xlink:href="#path"
                            stroke="none"
                            fill="url(#background-gradient)"/>
                    <use
                            xlink:href="#path"
                            stroke="url(#edge-gradient)"
                            stroke-width="{$toolbar_button_etch_width}"
                            fill="none"
                            transform="translate(0,{$toolbar_button_etch_width})"
                            clip-path="url(#top-half)"/>

                    <use
                            xlink:href="#path"
                            stroke="{$toolbar_button_etch_stroke}"
                            stroke-width="{$toolbar_button_etch_width}"
                            fill="none"
                            transform="translate(0,0)"/>
                </g>

            </g>
        </svg>

    </xsl:template>
</xsl:stylesheet>