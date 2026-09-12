<script setup>
import { ref, useId } from 'vue'
import { orderEndpoint, friendlyError } from './siteData.js'

const props = defineProps({
  orderNo: { type: String, default: '' }
})

const uid = useId()
const state = ref('idle') // idle | sending | success | error
const errorMessage = ref('')

async function report(e) {
  e.preventDefault()
  const fields = e.target.elements
  const last5 = fields.payInfo.value.trim()
  state.value = 'sending'

  try {
    const res = await fetch(orderEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'paid',
        orderNo: fields.orderNo.value.trim(),
        payInfo: last5 ? '末五碼 ' + last5 : '',
        website: fields.website.value
      })
    })
    const result = await res.json()
    if (!result.ok) throw new Error(result.error || '回報未能送出')
    state.value = 'success'
  } catch (err) {
    errorMessage.value = friendlyError(err)
    state.value = 'error'
  }
}
</script>

<template>
  <form class="pay-report" @submit="report" v-if="state !== 'success'">
    <div class="form-row">
      <label :for="`orderNo-${uid}`">訂單編號</label>
      <input
        type="text"
        :id="`orderNo-${uid}`"
        name="orderNo"
        inputmode="numeric"
        :value="orderNo"
        :readonly="Boolean(orderNo)"
        :class="{ 'is-prefilled': orderNo }"
        placeholder="例：1001"
        required
      >
    </div>
    <div class="form-row">
      <label :for="`payInfo-${uid}`">
        轉帳帳號末五碼／LINE Pay 交易序號末五碼
        <span class="form-optional">（選填，方便我們核對）</span>
      </label>
      <input type="text" :id="`payInfo-${uid}`" name="payInfo" inputmode="numeric" placeholder="例：12345">
    </div>
    <div class="form-honeypot" aria-hidden="true">
      <label :for="`website-${uid}`">網站</label>
      <input type="text" :id="`website-${uid}`" name="website" tabindex="-1" autocomplete="off">
    </div>
    <button type="submit" class="btn btn-primary btn-wide" :disabled="state === 'sending'">
      {{ state === 'sending' ? '回報中…' : '我已完成付款' }}
    </button>
    <p class="form-error" v-if="state === 'error'" role="alert">{{ errorMessage }}</p>
  </form>
  <p class="form-success" v-else role="status" aria-live="polite">
    已收到您的付款回報，我們核對收款後會盡快安排出貨，謝謝您。
  </p>
</template>
