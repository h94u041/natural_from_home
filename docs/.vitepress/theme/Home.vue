<script setup>
import { ref, computed, watch } from 'vue'
import { withBase } from 'vitepress'
import AppHeader from './AppHeader.vue'
import PaymentReport from './PaymentReport.vue'
import { contact, linePayUrl, pricing, pricingNote, notes, faqs, features, orderEndpoint } from './siteData.js'
import { taiwanAddress } from './taiwanAddress.js'

const submitState = ref('idle') // idle | sending | success | error
const errorMessage = ref('')
const orderNo = ref('')

const showSize = pricing.some(row => row.size)

const cities = Object.keys(taiwanAddress)
const city = ref('')
const district = ref('')
const districts = computed(() => taiwanAddress[city.value] || [])
watch(city, () => { district.value = '' })

async function submitOrder(e) {
  e.preventDefault()

  const fields = e.target.elements
  const road = fields.road.value.trim()
  const extra = fields.addressExtra.value.trim()
  const address = `${city.value}${district.value}${road}${extra ? '（' + extra + '）' : ''}`

  const payload = {
    name: fields.name.value.trim(),
    phone: fields.phone.value.trim(),
    address,
    spec: fields.spec.value,
    qty: fields.qty.value || '1',
    note: fields.note.value.trim(),
    website: fields.website.value // 蜜罐欄位，真人不會填
  }

  submitState.value = 'sending'

  try {
    // 用 text/plain 送出可以避開瀏覽器的 CORS 預檢請求，
    // Apps Script 才能正常回傳結果讓我們判斷成功與否
    const res = await fetch(orderEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })

    const result = await res.json()
    if (!result.ok) throw new Error(result.error || '訂單未能送出')

    orderNo.value = String(result.orderNo || '')
    submitState.value = 'success'
    e.target.reset()
    city.value = ''
    district.value = ''
  } catch (err) {
    // 連線失敗時瀏覽器丟出的是英文訊息，換成客人看得懂的說法
    errorMessage.value = err instanceof TypeError ? '網路連線失敗' : err.message
    submitState.value = 'error'
  }
}
</script>


<template>
  <a class="skip-link" href="#order">跳至訂購資訊</a>

  <AppHeader current="home" />

  <main>
    <!-- HERO -->
    <section class="hero">
      <div class="wrap hero-inner">
        <div class="hero-copy">
          <p class="eyebrow-free">新鮮水果．自產自銷</p>
          <h1>用心栽培每一顆梨，<br>把最真誠的心意<br>送到您手中</h1>
          <p class="hero-sub">果然自家 Fresh &amp; Natural — 台灣在地果園嚴選「寶島甘露梨」，清甜多汁、安心包裝，新鮮直送到家。</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#order">立即訂購</a>
            <a class="btn btn-ghost" href="#pricing">查看規格與價格</a>
          </div>
        </div>
        <div class="hero-visual">
          <img :src="withBase('/assets/pear-hero.jpg')" alt="新鮮寶島甘露梨，表皮帶著水珠，切開後可見細緻果肉與果核" class="hero-photo" width="295" height="320" fetchpriority="high">
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="features">
      <div class="wrap">
        <ul class="feature-list">
          <li v-for="f in features" :key="f.title" class="feature-item">
            <span class="feature-icon" aria-hidden="true">{{ f.icon }}</span>
            <h2>{{ f.title }}</h2>
            <p>{{ f.desc }}</p>
          </li>
        </ul>
        <p class="feature-banner">新鮮直送．品質保證</p>
      </div>
    </section>

    <!-- PRICING -->
    <section id="pricing" class="pricing">
      <div class="wrap">
        <h2 class="section-title">規格與價格</h2>
        <p class="section-note">{{ pricingNote }}</p>

        <div class="table-scroll">
          <table class="price-table">
            <caption class="sr-only">寶島甘露梨規格與價格表</caption>
            <thead>
              <tr>
                <th scope="col">規格</th>
                <th scope="col">每盒粒數</th>
                <th v-if="showSize" scope="col">每粒大小</th>
                <th scope="col">每層禮盒價格</th>
                <th scope="col">2層裝一箱<br>宅配價格</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pricing" :key="row.spec">
                <th scope="row">{{ row.spec }}</th>
                <td data-label="每盒粒數">{{ row.count }}</td>
                <td v-if="showSize" data-label="每粒大小" class="price-size">{{ row.size }}</td>
                <td data-label="每層禮盒價格">{{ row.boxPrice }}</td>
                <td data-label="2層裝一箱宅配" class="price-highlight">{{ row.shipPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <figure class="box-figure">
          <img :src="withBase('/assets/pear-box.jpg')" alt="寶島甘露梨禮盒實品照，木箱內裝六顆印有寶島甘露梨字樣的水果，分兩層排列" loading="lazy" width="302" height="344">
          <figcaption>寶島甘露梨禮盒，每盒 6 顆，分層包裝妥善保護果實</figcaption>
        </figure>
      </div>
    </section>

    <!-- NOTES -->
    <section class="notes">
      <div class="wrap">
        <h2 class="section-title section-title-alert">備註！</h2>
        <ol class="notes-list">
          <li v-for="(n, i) in notes" :key="i">
            <span>
              {{ typeof n === 'string' ? n : n.text }}
              <span v-if="n.example" class="notes-example">例：{{ n.example }}</span>
            </span>
          </li>
        </ol>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="faq">
      <div class="wrap">
        <h2 class="section-title">常見問題</h2>
        <div class="faq-list">
          <details v-for="(f, i) in faqs" :key="i" class="faq-item">
            <summary>{{ f.q }}</summary>
            <p>{{ f.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <!-- ORDER -->
    <section id="order" class="order">
      <div class="wrap order-inner">
        <div class="order-info">
          <h2 class="section-title">訂購方式</h2>
          <p class="order-lede">自產自銷．最安心的美味 ❤️ 感謝您的支持與推薦！</p>

          <div class="order-block">
            <h3>方式一：電話訂購</h3>
            <p>最快速的方式，直接撥打訂購專線，告知姓名、電話、地址、規格與數量即可。</p>
            <a class="btn btn-primary btn-wide" :href="`tel:${contact.phone}`">📞 撥打 {{ contact.phoneDisplay }}</a>
          </div>

          <div class="order-block">
            <h3>方式二：LINE Pay 付款</h3>
            <p>訂購後，我們會先與您確認金額，再請您用 LINE Pay 付款。<strong>付款備註請填寫您的訂單編號</strong>，方便我們核對。</p>
            <a class="btn btn-line btn-wide" :href="linePayUrl" target="_blank" rel="noopener">💚 LINE Pay 付款</a>
            <p class="pay-hint">用電腦看網頁的話，請用手機 LINE 掃描下方的 QR Code。</p>
            <details class="pay-report-toggle">
              <summary>已經付款了？點這裡回報</summary>
              <PaymentReport />
            </details>
          </div>

          <div class="order-block">
            <h3>方式三：線上訂購單</h3>
            <p class="order-form-note">填寫以下資訊並送出，會直接送到我們的訂單系統，送出後請保留畫面以便對帳。</p>
            <form class="order-form" @submit="submitOrder" v-show="submitState !== 'success'">
              <div class="form-row">
                <label for="name">收件人姓名</label>
                <input type="text" id="name" name="name" placeholder="王小明" required>
              </div>
              <div class="form-row">
                <label for="phone">聯絡電話</label>
                <input type="tel" id="phone" name="phone" placeholder="0912345678" required>
              </div>
              <fieldset class="form-address">
                <legend>收件地址</legend>
                <div class="form-address-grid">
                  <div class="form-row">
                    <label for="city">縣市</label>
                    <select id="city" name="city" v-model="city" required>
                      <option value="" disabled>請選擇</option>
                      <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
                    </select>
                  </div>
                  <div class="form-row">
                    <label for="district">鄉鎮市區</label>
                    <select id="district" name="district" v-model="district" :disabled="!city" required>
                      <option value="" disabled>{{ city ? '請選擇' : '請先選縣市' }}</option>
                      <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
                    </select>
                  </div>
                </div>
                <div class="form-row">
                  <label for="road">路／街與門牌</label>
                  <input type="text" id="road" name="road" placeholder="例：中正路 123 號" required>
                </div>
                <div class="form-row">
                  <label for="addressExtra">其他地址補充<span class="form-optional">（選填）</span></label>
                  <input type="text" id="addressExtra" name="addressExtra" placeholder="例：5 樓、公司名稱、管理室代收">
                </div>
              </fieldset>
              <div class="form-row">
                <label for="spec">規格與數量</label>
                <select id="spec" name="spec">
                  <option v-for="row in pricing" :key="row.spec" :value="`${row.spec}（${row.count}）`">
                    {{ row.spec }}（{{ row.count }}）— {{ row.boxPrice }}／盒
                  </option>
                </select>
              </div>
              <div class="form-row">
                <label for="qty">數量</label>
                <input type="number" id="qty" name="qty" min="1" value="1">
              </div>
              <div class="form-row">
                <label for="note">備註</label>
                <textarea id="note" name="note" rows="2" placeholder="如需禮盒裝請提前告知"></textarea>
              </div>
              <!-- 蜜罐：擋掉自動填表的機器人，真人看不到這個欄位 -->
              <div class="form-honeypot" aria-hidden="true">
                <label for="website">網站</label>
                <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
              </div>
              <button type="submit" class="btn btn-primary btn-wide" :disabled="submitState === 'sending'">
                {{ submitState === 'sending' ? '送出中…' : '送出訂購單' }}
              </button>
            </form>
            <div class="order-success" v-if="submitState === 'success'" role="status" aria-live="polite">
              <p class="form-success">
                ✅ 訂購單已送出！您的訂單編號是
                <strong class="order-no">{{ orderNo }}</strong>
                <span class="order-no-hint">請記下這個號碼</span>
              </p>
              <ol class="pay-steps">
                <li><div>我們會盡快用電話與您確認金額與出貨日期。</div></li>
                <li>
                  <div>
                    確認後請用 LINE Pay 付款，<strong>付款備註請填「{{ orderNo }}」</strong>。
                    <a class="btn btn-line btn-wide" :href="linePayUrl" target="_blank" rel="noopener">💚 LINE Pay 付款</a>
                    <span class="pay-hint">用電腦看網頁的話，請用手機 LINE 掃描下方的 QR Code。</span>
                  </div>
                </li>
                <li>
                  <div>
                    付款完成後，請在這裡回報，我們核對後就會安排出貨：
                    <PaymentReport :order-no="orderNo" />
                  </div>
                </li>
              </ol>
            </div>
            <p class="form-error" v-if="submitState === 'error'" role="alert">
              ⚠️ 訂購單送出失敗（{{ errorMessage }}）。<br>
              請直接撥打訂購專線 <a :href="`tel:${contact.phone}`">{{ contact.phoneDisplay }}</a> 訂購，謝謝您！
            </p>
          </div>
        </div>

        <div class="order-side">
          <div class="qr-card">
            <p class="qr-title">LINE Pay</p>
            <div class="qr-frame">
              <img :src="withBase('/assets/qr-linepay.png')" alt="LINE Pay 付款 QR Code" class="qr-crop" loading="lazy" width="540" height="486">
            </div>
            <p class="qr-caption">掃描 QR Code 付款</p>
            <a class="btn btn-line btn-wide" :href="linePayUrl" target="_blank" rel="noopener">手機請點這裡付款</a>
          </div>
          <a v-if="contact.lineOfficialUrl" class="line-card" :href="contact.lineOfficialUrl" target="_blank" rel="noopener">
            <span class="line-card-label">有問題想問？</span>
            <span class="line-card-action">💬 加 LINE 官方帳號聊聊</span>
          </a>
          <div class="phone-card">
            <p class="phone-label">訂購專線</p>
            <a :href="`tel:${contact.phone}`" class="phone-number">{{ contact.phoneDisplay }}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="closing">
      <div class="wrap">
        <p>自產自銷．最安心的美味 ❤️ 感謝您的支持與推薦！</p>
        <p class="closing-sub">自產自銷．品質安心・自然熟成．香甜多汁</p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <p>© {{ new Date().getFullYear() }} 果然自家 Fresh &amp; Natural．台灣在地果園自產自銷</p>
    </div>
  </footer>
</template>
