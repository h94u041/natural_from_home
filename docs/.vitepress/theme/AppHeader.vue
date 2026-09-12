<script setup>
import { withBase } from 'vitepress'
import { contact } from './siteData.js'

defineProps({
  current: { type: String, default: 'home' }
})
</script>

<template>
  <header class="site-header">
    <div class="wrap header-inner">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true">🍐</span>
        <div class="brand-text">
          <p class="brand-name">果然自家</p>
          <p class="brand-en">FRESH &amp; NATURAL</p>
        </div>
      </div>

      <a class="header-cta" :href="`tel:${contact.phone}`">
        <span class="cta-label">訂購專線</span>
        <span class="cta-number">{{ contact.phoneDisplay }}</span>
      </a>
    </div>
  </header>

  <!-- 頁面切換：固定在畫面最上方的凍結條 -->
  <nav class="nav-tabs" aria-label="主選單">
    <div class="wrap nav-tabs-inner">
      <a
        :href="withBase('/')"
        :class="{ active: current === 'home' }"
        :aria-current="current === 'home' ? 'page' : undefined"
      >
        <span class="tab-icon" aria-hidden="true">🏠</span>首頁訂購
      </a>
      <a
        :href="withBase('/Fresh&natural')"
        :class="{ active: current === 'intro' }"
        :aria-current="current === 'intro' ? 'page' : undefined"
      >
        <span class="tab-icon" aria-hidden="true">📋</span>簡介圖
      </a>
    </div>
  </nav>
</template>
