import fs from 'fs'
import sharp from 'sharp'
import TextToSVG from 'text-to-svg'

const generateOGP = function() {
  const textToSVG = TextToSVG.loadSync('./static/font/NotoSerifJP-Medium.otf')
  const fileNames = fs.readdirSync('./data')
  for (const key in fileNames) {
    const file = JSON.parse(fs.readFileSync('./data/' + fileNames[key], 'utf8'))
    const textSvg = textToSVG.getSVG(file.title, {
      x: 0,
      y: 0,
      fontSize: 100,
      anchor: 'top',
      attributes: { fill: 'black', stroke: 'white' }
    })
    sharp('./static/img/' + file.thumbnail)
      .composite([
        {
          input: Buffer.from(textSvg)
        }
      ])
      .resize(1200, 630)
      .toFile('./static/ogp/' + file.slug + '.png', (error) => {
        // eslint-disable-next-line no-console
        if (error) console.log('OGP Generate Error: ' + error)
      })
  }
}

module.exports = function() {
  this.nuxt.hook('generate:before', (generator) => {
    // eslint-disable-next-line no-console
    console.log('OgpGenerater:start')
    generateOGP()
    // eslint-disable-next-line no-console
    console.log('OgpGenerater:finish')
  })
}
