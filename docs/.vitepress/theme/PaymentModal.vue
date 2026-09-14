<script setup>
import { ref, watch, computed } from 'vue'
import LinePayBox from './LinePayBox.vue'
import PaymentReport from './PaymentReport.vue'

const props = defineProps({
  orderNo: { type: String, default: '' },
  // 銀行轉帳資訊由訂單系統回傳（存在 Apps Script 的指令碼屬性，不放在網站程式碼）
  bank: { type: Object, default: null },
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const dialog = ref(null)
const copied = ref(false)
const reported = ref(false)
const accountGrouped = computed(() => (props.bank?.account || '').replace(/(\d{4})(?=\d)/g, '$1 '))

watch(() => props.open, (isOpen) => {
  if (!dialog.value) return
  if (isOpen && !dialog.value.open) dialog.value.showModal()
  if (!isOpen && dialog.value.open) dialog.value.close()
})

// 換了新訂單就重置回報狀態
watch(() => props.orderNo, () => { reported.value = false })

async function copyAccount() {
  try {
    await navigator.clipboard.writeText(props.bank.account)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // 舊瀏覽器不支援剪貼簿，帳號本來就顯示在畫面上，客人可以手動抄
  }
}
</script>

<template>
  <dialog ref="dialog" class="pay-modal" @close="emit('close')" aria-labelledby="pay-modal-title">
    <div class="pay-modal-inner">
      <button type="button" class="pay-modal-close" @click="emit('close')" aria-label="關閉">×</button>

      <h2 id="pay-modal-title" class="pay-modal-title">訂購單已送出</h2>
      <p class="pay-modal-orderno">
        您的訂單編號
        <strong class="order-no">{{ orderNo }}</strong>
      </p>
      <p class="pay-modal-remind">
        付款時請在<strong>備註填寫訂單編號 {{ orderNo }} 或您的姓名</strong>，我們才能核對是哪一筆訂單。
      </p>

      <section class="pay-option">
        <h3>方式 A：LINE Pay</h3>
        <LinePayBox />
      </section>

      <template v-if="bank">
        <p class="pay-or">或</p>
        <section class="pay-option">
          <h3>方式 B：銀行轉帳</h3>
          <div class="bank-box">
            <p class="bank-line"><span>銀行</span><strong>{{ bank.name }}<template v-if="bank.code">（{{ bank.code }}）</template></strong></p>
            <p class="bank-line"><span>帳號</span><strong class="bank-account">{{ accountGrouped }}</strong></p>
            <p class="bank-line" v-if="bank.holder"><span>戶名</span><strong>{{ bank.holder }}</strong></p>
            <button type="button" class="btn btn-ghost btn-wide" @click="copyAccount">
              {{ copied ? '已複製帳號' : '複製帳號' }}
            </button>
          </div>
        </section>
      </template>

      <section class="pay-option">
        <h3>付款完成後，請回報</h3>
        <PaymentReport :key="orderNo" :order-no="orderNo" @reported="reported = true" />
      </section>

      <button type="button" class="btn pay-modal-done" :class="reported ? 'btn-primary' : 'btn-ghost'" @click="emit('close')">
        {{ reported ? '果然自家 感謝您的支持' : '稍後再付款，先關閉' }}
      </button>
    </div>
  </dialog>
</template>
