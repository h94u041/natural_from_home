<script setup>
import { withBase } from 'vitepress'
import { linePayUrl } from './siteData.js'
</script>

<template>
  <div class="linepay-box">
    <div class="linepay-qr">
      <img :src="withBase('/assets/qr-linepay.png')" alt="LINE Pay 付款 QR Code" class="qr-crop" loading="lazy" width="600" height="600">
    </div>
    <div class="linepay-actions">
      <a class="btn btn-line btn-wide" :href="linePayUrl" target="_blank" rel="noopener">💚 LINE Pay 付款</a>
    </div>
  </div>
</template>
