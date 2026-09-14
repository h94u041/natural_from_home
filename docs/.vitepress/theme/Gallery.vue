<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'
import { gallery } from './gallery.js'

const index = ref(0)
const count = gallery.length
const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let timer = null
function go(n) { index.value = (n + count) % count }
function next() { go(index.value + 1) }
function prev() { go(index.value - 1) }

function startAuto() {
  stopAuto()
  if (count > 1 && !reduceMotion) timer = setInterval(next, 6000)
}
function stopAuto() { if (timer) { clearInterval(timer); timer = null } }

// 手指左右滑動換圖
let startX = 0
function onPointerDown(e) { startX = e.clientX; stopAuto() }
function onPointerUp(e) {
  const dx = e.clientX - startX
  if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
  startAuto()
}

onMounted(startAuto)
onUnmounted(stopAuto)
</script>

<template>
  <div v-if="count" class="gallery" @mouseenter="stopAuto" @mouseleave="startAuto">
    <div class="gallery-frame" @pointerdown="onPointerDown" @pointerup="onPointerUp">
      <div class="gallery-track" :style="{ transform: `translateX(-${index * 100}%)` }">
        <figure v-for="(g, i) in gallery" :key="g.src" class="gallery-slide" :aria-hidden="i !== index">
          <img :src="withBase(g.src)" :alt="g.alt" :loading="i === 0 ? 'eager' : 'lazy'" draggable="false">
        </figure>
      </div>

      <template v-if="count > 1">
        <button type="button" class="gallery-arrow gallery-prev" @click="prev(); startAuto()" aria-label="上一張">‹</button>
        <button type="button" class="gallery-arrow gallery-next" @click="next(); startAuto()" aria-label="下一張">›</button>
      </template>
    </div>

    <p class="gallery-caption" aria-live="polite">{{ gallery[index].caption }}</p>

    <div v-if="count > 1" class="gallery-dots" role="tablist">
      <button
        v-for="(g, i) in gallery"
        :key="g.src"
        type="button"
        class="gallery-dot"
        :class="{ active: i === index }"
        :aria-label="`第 ${i + 1} 張，共 ${count} 張`"
        :aria-selected="i === index"
        @click="go(i); startAuto()"
      ></button>
    </div>
  </div>
</template>
