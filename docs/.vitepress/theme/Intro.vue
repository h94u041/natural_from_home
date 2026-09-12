<script setup>
import { withBase } from 'vitepress'
import AppHeader from './AppHeader.vue'
import { contact } from './siteData.js'

const BULB_COUNT = 32
const BULB_COLORS = ['#ff4d4d', '#ffd23f', '#3ddc84', '#38b6ff', '#c56bff']

// 沿著相框四邊平均分佈燈泡：0~1 依序對應上／右／下／左邊，
// 用百分比座標定位，不用管實際像素長寬比也能均勻繞一圈
function bulbStyle(n) {
  const t = ((n - 1) / BULB_COUNT) * 4
  let top, left
  if (t < 1) { top = 0; left = t }
  else if (t < 2) { top = t - 1; left = 1 }
  else if (t < 3) { top = 1; left = 1 - (t - 2) }
  else { top = 1 - (t - 3); left = 0 }

  return {
    top: `${top * 100}%`,
    left: `${left * 100}%`,
    '--bulb-color': BULB_COLORS[n % BULB_COLORS.length],
    animationDelay: `${(n % 8) * 0.18}s`
  }
}
</script>

<template>
  <AppHeader current="intro" />

  <main>
    <section class="intro">
      <div class="wrap">
        <h1 class="section-title">品牌簡介</h1>
        <p class="section-note">果然自家 Fresh &amp; Natural — 台灣在地果園自產自銷，用心栽培每一顆梨，把最真誠的心意送到您手中。</p>

        <div class="light-frame">
          <span
            v-for="n in BULB_COUNT"
            :key="n"
            class="bulb"
            :style="bulbStyle(n)"
            aria-hidden="true"
          ></span>
          <img
            :src="withBase('/assets/nature_.jpg')"
            alt="果然自家宣傳海報：品牌介紹、三大特色、寶島甘露梨規格與價格表、備註事項與 LINE Pay 訂購資訊"
            class="intro-photo"
            loading="lazy"
          >
        </div>

        <div class="intro-actions">
          <a class="btn btn-primary btn-wide" :href="`tel:${contact.phone}`">撥打 {{ contact.phoneDisplay }}</a>
          <a class="btn btn-ghost btn-wide" :href="withBase('/#order')">回首頁線上訂購</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <p>© {{ new Date().getFullYear() }} 果然自家 Fresh &amp; Natural．台灣在地果園自產自銷</p>
    </div>
  </footer>
</template>
