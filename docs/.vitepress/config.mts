import { defineConfig } from 'vitepress'

// ==========================================================================
// ⭐ 只要改這裡：你的正式網址
// 例如 repo 叫 guoran-zijia，帳號叫 fruitfarm，網址就是
// https://fruitfarm.github.io/guoran-zijia/
// 如果是用自訂網域（例如 https://guoranzijia.com/），SITE_URL 結尾也要有斜線，
// 同時把下面 base 改成 '/'
// ==========================================================================
const SITE_URL = 'https://h94u041.github.io/natural_from_home/'
const BASE_PATH = '/natural_from_home/'

const SITE_TITLE = '果然自家 Fresh & Natural'
const SITE_TITLE_FULL = '果然自家｜台灣在地寶島甘露梨 自產自銷直送宅配'
const SITE_DESCRIPTION = '果然自家｜台灣在地果園自產自銷新鮮水果，寶島甘露梨清甜多汁、安心包裝新鮮直送。提供28A、32A、38A、34A等規格禮盒與宅配，LINE Pay線上付款，電話訂購 0911-744-835。'
const OG_IMAGE = `${SITE_URL}assets/pear-box.jpg`

export default defineConfig({
  lang: 'zh-Hant-TW',
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,

  base: BASE_PATH,

  cleanUrls: true,
  lastUpdated: true,

  // 讓每一頁都自動產生正確的 canonical 網址（避免重複內容問題，對 SEO 很重要）
  transformPageData(pageData) {
    const canonicalUrl = `${SITE_URL}${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:url', content: canonicalUrl }]
    )
  },

  head: [
    // Favicon（用海報上的品牌 logo）
    ['link', { rel: 'icon', type: 'image/png', href: `${BASE_PATH}assets/logo.png` }],

    // 標題用襯線字體，較有手作／傳統果園的味道
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700;900&display=swap' }],

    // 基本 SEO
    ['meta', { name: 'keywords', content: '果然自家,寶島甘露梨,甘露梨,台灣水果,水果禮盒,梨子宅配,自產自銷,新鮮水果,台中水果,水果禮盒訂購,水果宅配,梨子產地直送,Taiwan pear,fresh fruit gift box' }],
    ['meta', { name: 'author', content: SITE_TITLE }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
    ['meta', { name: 'theme-color', content: '#2F4A2E' }],

    // 語言標記（有助搜尋引擎判斷語系，即使目前只有繁中版）
    ['link', { rel: 'alternate', hreflang: 'zh-Hant-TW', href: SITE_URL }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: SITE_URL }],

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: SITE_TITLE }],
    ['meta', { property: 'og:title', content: SITE_TITLE_FULL }],
    ['meta', { property: 'og:description', content: '用心栽培每一顆梨，把最真誠的心意送到您手中。台灣在地果園嚴選，清甜多汁、安心包裝，新鮮直送到家。' }],
    ['meta', { property: 'og:image', content: OG_IMAGE }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:locale', content: 'zh_TW' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: SITE_TITLE_FULL }],
    ['meta', { name: 'twitter:description', content: '用心栽培每一顆梨，把最真誠的心意送到您手中。清甜多汁、安心包裝，新鮮直送到家。' }],
    ['meta', { name: 'twitter:image', content: OG_IMAGE }],

    // JSON-LD 結構化資料 — 有助 Google 顯示豐富搜尋結果（星級、價格、電話等）
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Store',
        '@id': `${SITE_URL}#store`,
        name: SITE_TITLE,
        alternateName: '果然自家',
        description: '台灣在地果園自產自銷新鮮水果，主打寶島甘露梨，清甜多汁、安心包裝、新鮮直送。',
        url: SITE_URL,
        telephone: '+886-911-744-835',
        image: OG_IMAGE,
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          addressRegion: '台中市',
          addressCountry: 'TW'
        },
        areaServed: {
          '@type': 'Country',
          name: '台灣'
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: '寶島甘露梨禮盒',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Product', name: '寶島甘露梨禮盒 28A（大6粒）' },
              price: '1150',
              priceCurrency: 'TWD',
              availability: 'https://schema.org/InStock'
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Product', name: '寶島甘露梨禮盒 32A（5粒）' },
              price: '1350',
              priceCurrency: 'TWD',
              availability: 'https://schema.org/InStock'
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Product', name: '寶島甘露梨禮盒 38A（4粒）' },
              price: '1550',
              priceCurrency: 'TWD',
              availability: 'https://schema.org/InStock'
            }
          ]
        }
      })
    ],

    // BreadcrumbList（單頁網站用簡化版，仍有助 Google 辨識網站結構）
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首頁', item: SITE_URL }
        ]
      })
    ],

    // FAQPage — 對應頁面上的「常見問題」區塊，Google 有機會在搜尋結果直接展開問答
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '寶島甘露梨可以配送到外島嗎？',
            acceptedAnswer: { '@type': 'Answer', text: '外島地區因物流公司不提供配送服務，故不接受訂單，敬請見諒。' }
          },
          {
            '@type': 'Question',
            name: '收到禮盒發現水果或紙箱有受損怎麼辦？',
            acceptedAnswer: { '@type': 'Answer', text: '到貨時若發現紙箱或水果表面有受損情形，請立即拍照存證並通知我們，謝謝您的協助！' }
          },
          {
            '@type': 'Question',
            name: '寶島甘露梨的規格怎麼選？',
            acceptedAnswer: { '@type': 'Answer', text: '規格越小顆數越多、單顆越大顆數越少：28A每盒6顆最超值，32A每盒5顆，38A每盒4顆果實更大，34A／38A↑為2顆裝，適合小量嚐鮮或送禮試吃。' }
          },
          {
            '@type': 'Question',
            name: '訂購時需要提供哪些資訊？',
            acceptedAnswer: { '@type': 'Answer', text: '請提供收件人姓名、聯絡電話、收件地址，以及想要的規格與數量。' }
          },
          {
            '@type': 'Question',
            name: '宅配是禮盒裝還是箱裝？',
            acceptedAnswer: { '@type': 'Answer', text: '宅配預設皆為箱裝（無禮盒裝）。若需要以禮盒裝方式宅配，請提前告知我們安排。' }
          }
        ]
      })
    ]
  ],

  sitemap: {
    hostname: SITE_URL
  },

  themeConfig: {
    // 用不到預設 nav/sidebar，首頁是完全自訂 layout
  }
})
