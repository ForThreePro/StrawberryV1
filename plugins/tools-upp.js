import crypto from "crypto"
import { FormData, Blob } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) {
    await react('🍓')
    return conn.reply(m.chat, `‧˚꒰🍓୭ 𓆩 𝗦𝗧𝗥𝗔𝗪𝗕𝗘𝗥𝗥𝗬 𝗕𝗢𝗧 𓆪 🎀\n\n⤷ ┇ 𝐔𝐏𝐋𝐎𝐀𝐃𝐄𝐑 ﹒ USO ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n➛ Responde a una *imagen, video, audio o documento* para subirlo, fresita. 👻🎀`, m)
  }

  try {
    await react('⏳')
    let media = await q.download()
    let link = await myCloud(media)
    if (!link.url) throw new Error('Sin URL')

    let txt = `‧˚꒰🍓୭ 𓆩 𝗦𝗧𝗥𝗔𝗪𝗕𝗘𝗥𝗥𝗬 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐔𝐏𝐋𝐎𝐀𝐃𝐄𝐑 ﹒ COMPLETADO ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`RESULTADO\`\` 🍓 —˙𖦹.꒷

── *📊 DATOS* ╏ 🎀
🔗 ➛ ${link.url}
📦 ➛ ${formatBytes(media.length)}
🖥️ ➛ evogb.win

━━━━━━━━━━━
🍓 *STRAWBERRY BOT - HALLOWEEN COQUETTE* 🎀
━━━━━━━━━━━`

    await react('🎀')
    await conn.reply(m.chat, txt, m)
  } catch (e) {
    await react('💔')
    await conn.reply(m.chat, `‧˚꒰🍓୭ 𓆩 𝗦𝗧𝗥𝗔𝗪𝗕𝗘𝗥𝗥𝗬 𝗕𝗢𝗧 𓆪 🎀\n\n💔 Oopsie, no pude subir tu archivito, fresita.`, m)
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

async function myCloud(content) {
  const fileType = await fileTypeFromBuffer(content)
  const ext = fileType? fileType.ext : 'bin'
  const mime = fileType? fileType.mime : 'application/octet-stream'
  const formData = new FormData()
  formData.append("file", new Blob([content], { type: mime }), `${crypto.randomBytes(5).toString("hex")}.${ext}`)
  const response = await fetch("https://evogb.win/api/upload", { method: "POST", body: formData })
  if (!response.ok) throw new Error('Error en el servidor')
  return await response.json()
}

handler.help = ['upp', 'tourl'];
handler.tags = ['tools'];
handler.command = ['upp', 'tourl'];
export default handler