<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/2000/svg">

    <xsl:output method="text"/>

    <xsl:param name="css_attribute"/>
    <xsl:param name="css_selector"/>
    <xsl:param name="css_value"/>
    <xsl:param name="css_value_postfix"/>
    <xsl:param name="css_value_is_url"/>
    <xsl:param name="css_attribute_prefixes"/>
    <xsl:param name="lab_sequence_number_css_attribute"/>
    <xsl:param name="lab_max_sequence_number_css_attribute"/>

    <xsl:template match="/">
        <xsl:if test="$lab_sequence_number_css_attribute = 0">
            <xsl:value-of select="$css_selector"/><xsl:text> {
</xsl:text>
        </xsl:if>
        <xsl:call-template name="append_value">
            <xsl:with-param name="attribute_name" select="$css_attribute"/>
            <xsl:with-param name="attribute_value" select="$css_value"/>
            <xsl:with-param name="attribute_value_is_url" select="$css_value_is_url"/>
            <xsl:with-param name="attribute_value_postfix" select="$css_value_postfix"/>
            <xsl:with-param name="attribute-prefixes" select="normalize-space($css_attribute_prefixes)"/>
        </xsl:call-template>
        <xsl:if test="$lab_sequence_number_css_attribute = $lab_max_sequence_number_css_attribute">
            <xsl:text>}

</xsl:text>
        </xsl:if>
    </xsl:template>

    <xsl:template name="append_value">
        <xsl:param name="attribute_name"/>
        <xsl:param name="attribute_value"/>
        <xsl:param name="attribute_value_postfix"></xsl:param>
        <xsl:param name="attribute_value_is_url"/>
        <xsl:param name="attribute-prefixes"></xsl:param>

        <xsl:if test="$attribute_name and $attribute_value">

            <xsl:variable name="attribute-prefix">
                <xsl:choose>
                    <xsl:when test="contains($attribute-prefixes, ' ')">
                        <xsl:value-of select="substring-before($attribute-prefixes, ' ')"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="$attribute-prefixes"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:variable>

            <xsl:text>    </xsl:text>
            <xsl:value-of select="normalize-space($attribute-prefix)"/><xsl:value-of select="normalize-space($attribute_name)"/><xsl:text>:</xsl:text>
            <xsl:if test="$attribute_value_is_url = 'true'">
                <xsl:text>url('</xsl:text>
            </xsl:if>
            <xsl:value-of select="normalize-space($attribute_value)"/>
            <xsl:if test="$attribute_value_is_url = 'true'">
                <xsl:text>')</xsl:text>
            </xsl:if>
            <xsl:if test="string-length(normalize-space($attribute_value_postfix)) > 0">
                <xsl:text> </xsl:text>
                <xsl:value-of select="normalize-space($attribute_value_postfix)"/>
            </xsl:if>
            <xsl:text>;
</xsl:text>

            <xsl:if test="string-length($attribute-prefix) > 0">
                <xsl:call-template name="append_value">
                    <xsl:with-param name="attribute_name" select="$attribute_name"/>
                    <xsl:with-param name="attribute_value" select="$attribute_value"/>
                    <xsl:with-param name="attribute_value_is_url" select="$attribute_value_is_url"/>
                    <xsl:with-param name="attribute_value_postfix" select="$attribute_value_postfix"/>
                    <xsl:with-param name="attribute-prefixes">
                        <xsl:choose>
                            <xsl:when test="contains($attribute-prefixes, ' ')">
                                <xsl:value-of select="substring-after($attribute-prefixes, ' ')"/>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:text></xsl:text>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:with-param>
                </xsl:call-template>
            </xsl:if>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>