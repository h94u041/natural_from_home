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
      <p class="linepay-hint">
        <strong>用手機看：</strong>直接按綠色按鈕<br>
        <strong>用電腦看：</strong>打開手機 LINE 掃描 QR Code
      </p>
    </div>
  </div>
</template>
