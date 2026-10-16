import axios from 'axios'
import FormData from 'form-data'

async function stellarUpscale(buffer, scale, key) {
  let form = new FormData()
  form.append('file', buffer, { filename: `upscale-${scale}.jpg`, contentType: 'image/jpeg' })
  let url = `https://api.stellarwa.xyz/tools/upscale?method=local&scale=${scale}&key=${key}`
  let { data } = await axios.post(url, form, {
    headers: form.getHeaders(),
    responseType: 'arraybuffer',
    timeout: 90000
  })
  let str = data.toString('utf8').slice(0, 500)
  if (str.trim().startsWith('{')) {
    try {
      let json = JSON.parse(data.toString())
      let resultUrl = json.result || json.data || json.url
      if (resultUrl) {
        let img = await axios.get(resultUrl, { responseType: 'arraybuffer' })
        return Buffer.from(img.data)
      }
    } catch {}
  }
  return Buffer.from(data)
}

let handler = async (m, { conn, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!/image/.test(mime)) {
    return conn.reply(m.chat, 
`‧˚꒰🍓୭ 𓆩 𝗦𝗧𝗥𝗔𝗪𝗕𝗘𝗥𝗥𝗬 𝗕𝗢𝗧 𓆪 🎀
*Halloween Coquette Edition*

💋 Oops! Responde a una fotito con *${usedPrefix}hd* preciosa

> 🍓 Haré magia: x2 → x4 automático
> 🎀 Quedará super HD y coqueta`, m)
  }

  let key = 'proyectsV2'
  try {
    await conn.sendMessage(m.chat, { react: { text: '🍓', key: m.key } })
    let media = await q.download()

    await conn.reply(m.chat, 
`‧˚꒰🍓୭ 𓆩 𝗦𝗧𝗥𝗔𝗪𝗕𝗘𝗥𝗥𝗬 𝗕𝗢𝗧 𓆪 🎀

👻 *PASO 1/2:* Mejorando tu fotito a x2...
💅 Espera un poquito, reina.`, m)
    let firstHD = await stellarUpscale(media, 2, key)

    await conn.reply(m.chat, 
`‧˚꒰🍓୭ 𓆩 𝗦𝗧𝗥𝗔𝗪𝗕𝗘𝗥𝗥𝗬 𝗕𝗢𝗧 𓆪 🎀

🎃 *PASO 2/2:* Ahora a x4... casi lista para tu Insta coquette.`, m)
    let finalHD = await stellarUpscale(firstHD, 2, key)

    await conn.sendFile(m.chat, finalHD, 'strawberry-hd.jpg', 
`‧˚꒰🍓୭ 𓆩 *HD x4 COMPLETADO* 𓆪 🎀

> ✿ Listo, hermosa! ${m.pushName} 🍓
> ✿ x2 → x4 automático | Coquette Magic
> ✿ Strawberry Bot | Halloween Edition
> ✿ Hecha con amor y fresitas 👻🎀`, m)

    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })
  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '💔', key: m.key } })
    conn.reply(m.chat, `‧˚꒰🍓୭ 𓆩 𝗦𝗧𝗥𝗔𝗪𝗕𝗘𝗥𝗥𝗬 𝗕𝗢𝗧 𓆪 🎀\n\n💔 Oopsie, hubo un error: ${e.message}\n> Intenta de nuevo, fresita.`, m)
  }
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = ['hd', 'upscale', 'mejorar', 'remini', 'strawberryhd']
export default handler