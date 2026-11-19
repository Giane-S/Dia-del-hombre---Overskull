import QRCode from 'qrcode'
import fs from 'fs'

const targetUrl = 'https://giane-s.github.io/Dia-del-hombre---Overskull/'

async function run() {
  // 1. Classic High-Res PNG (1024x1024)
  await QRCode.toFile('qr-code.png', targetUrl, {
    width: 1024,
    margin: 2,
    color: {
      dark: '#172536',  // Overskull Navy
      light: '#FFFFFF'  // White background
    }
  })

  // 2. Vector SVG
  const svgString = await QRCode.toString(targetUrl, {
    type: 'svg',
    margin: 2,
    color: {
      dark: '#172536',
      light: '#FFFFFF'
    }
  })
  fs.writeFileSync('qr-code.svg', svgString, 'utf-8')

  console.log('QR codes generated successfully for:', targetUrl)
}

run().catch(console.error)
