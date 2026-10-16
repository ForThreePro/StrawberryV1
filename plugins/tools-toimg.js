import { webp2mp4 } from '../lib/webp2mp4.js'
import { toAudio } from '../lib/converter.js'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const head = `‧˚꒰🍓୭ 𓆩 𝗦𝗧𝗥𝗔𝗪𝗕𝗘𝗥𝗥𝗬 𝗕𝗢𝗧 𓆪 🎀\n\n꒰ ◞⁺⊹ ．${fecha}\n`

  if (['tovid', 'tovideo'].includes(command)) {
    if (!m.quoted || !/webp/.test(m.quoted.mimetype || '')) {
      await react('🍓')
      return conn.reply(m.chat, head + `🍓 Responde a un *sticker coqueto*, fresita.`, m)
    }
    try {
      await react('⏳')
      let media = await m.quoted.download()
      let out = await webp2mp4(media)
      await react('🎀')
      await conn.sendFile(m.chat, out, 'video.mp4', head + `🎀 *Tovideo completado, reina* 👻`, m)
    } catch { await react('💔'); await conn.reply(m.chat, head + `💔 No se pudo convertir tu sticker, fresita.`, m) }
  }

  if (['tomp3', 'toaudio'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if (!/video|audio/.test(mime)) { await react('🍓'); return conn.reply(m.chat, head + `🍓 Responde a un *video o audio*, hermosa.`, m) }
    try {
      await react('⏳')
      let media = await q.download?.()
      let audio = await toAudio(media, 'mp4')
      await react('🎀')
      await conn.sendFile(m.chat, audio.data, 'audio.mp3', head + `🎀 *Audio extraído con amor fresita* 🍓`, m, null, { mimetype: 'audio/mp4' })
    } catch { await react('💔'); await conn.reply(m.chat, head + `💔 No se pudo convertir a audio, preciosa.`, m) }
  }

  if (['toimg', 'simg'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    if (!((q.mimetype || '').includes('webp'))) { await react('🍓'); return conn.reply(m.chat, head + `🍓 Responde a un *sticker*, fresita.`, m) }
    try {
      await react('⏳')
      let media = await q.download()
      await react('🎀')
      await conn.sendMessage(m.chat, { image: media, caption: head + `🍓 *Sticker a imagen coquette* 🎀` }, { quoted: m })
    } catch { await react('💔'); await conn.reply(m.chat, head + `💔 No se pudo convertir, reina.`, m) }
  }
}

handler.help = ['tovid', 'tomp3', 'toimg']
handler.tags = ['tools']
handler.command = ['tovid', 'tovideo', 'tomp3', 'toaudio', 'toimg', 'stickerimg', 'simg']
export default handler