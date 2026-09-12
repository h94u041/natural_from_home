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
      <a class="brand" :href="withBase('/')">
        <img :src="withBase('/assets/logo.png')" alt="" class="brand-logo" width="150" height="122">
        <div class="brand-text">
          <p class="brand-name">果然自家</p>
          <p class="brand-en">FRESH &amp; NATURAL</p>
        </div>
      </a>

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
      >首頁訂購</a>
      <a
        :href="withBase('/Fresh&natural')"
        :class="{ active: current === 'intro' }"
        :aria-current="current === 'intro' ? 'page' : undefined"
      >簡介圖</a>
    </div>
  </nav>
</template>
