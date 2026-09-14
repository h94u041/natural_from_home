// 從 README.md「產品照片」段落讀出圖片與說明，給首頁輪播圖用。
// 維護照片與文字只要改 README.md，不用碰這裡。
import readme from '../../../README.md?raw'

const section = readme.split(/^## 產品照片\s*$/m)[1]?.split(/^## /m)[0] ?? ''
const lines = section.replace(/<!--[\s\S]*?-->/g, '').split('\n')

export const gallery = []

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^!\[(.*?)\]\((.+?)\)\s*$/)
  if (!m) continue

  // README 裡寫的是 repo 相對路徑 docs/public/xxx，網站上要換成 /xxx
  const src = '/' + m[2].replace(/^docs\/public\//, '')

  let caption = ''
  for (let j = i + 1; j < lines.length; j++) {
    const t = lines[j].trim()
    if (!t) { if (caption) break; else continue }
    if (t.startsWith('![') || t.startsWith('#')) break
    caption += (caption ? ' ' : '') + t
  }

  gallery.push({ src, alt: m[1] || caption, caption })
}
