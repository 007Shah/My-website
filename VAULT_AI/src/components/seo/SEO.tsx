import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: string
  canonical?: string
  noindex?: boolean
  structuredData?: Record<string, unknown>
}

export default function SEO({
  title = 'AIVault - One Vault. Every AI.',
  description = 'Compare, subscribe, and manage the best AI tools in one place. ChatGPT, Midjourney, Claude, Gemini, and 40+ more AI tools.',
  keywords = 'AI tools, AI marketplace, ChatGPT, Midjourney, Claude, Gemini, AI subscription, AI software, generative AI',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  canonical = 'https://aivault.io',
  noindex = false,
  structuredData,
}: SEOProps) {
  const siteName = 'AIVault'
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`

  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AIVault',
    url: 'https://aivault.io',
    logo: 'https://aivault.io/logo.png',
    description: 'AI subscription marketplace - compare and manage AI tools in one dashboard',
    sameAs: [
      'https://twitter.com/aivault',
      'https://github.com/aivault',
      'https://linkedin.com/company/aivault',
    ],
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="AIVault" />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@aivault" />

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#050505" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="AIVault" />

      {/* PWA */}
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  )
}
