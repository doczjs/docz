import React from 'react'
import { Helmet } from 'react-helmet'

import { useDbQuery } from '../hooks/useDbQuery'

interface SEOProps {
  title: string
  description?: string
  lang?: string
  meta?: []
  keywords?: string[]
}

const SEO: React.FunctionComponent<SEOProps> = ({
  description,
  lang = 'en',
  meta = [],
  keywords = [],
  title: initialTitle,
}) => {
  const db = useDbQuery()
  const title = initialTitle || db.config.title
  const metaDescription = description || db.config.description

  return (
    <Helmet
      title={title}
      titleTemplate={`%s | ${db.config.title}`}
      htmlAttributes={{ lang }}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ]
        .concat(
          keywords && keywords.length > 0
            ? {
                name: `keywords`,
                content: keywords.join(`, `),
              }
            : []
        )
        .concat(meta)}
    />
  )
}

export default SEO
