import React, { useState, useMemo } from 'react'

import { Button } from '@iotabots/components'
import Grid from '../components/Pixel/Grid'
import ColorPicker from '../components/Pixel/ColorPicker'

import {
  BaseLayout,
  Container,
  Section,
  SectionHeader,
  Typography,
} from '@iotabots/components'
const offCell = {
  on: false,
  color: '#000000',
}
import domtoimage from 'dom-to-image'

const initialCells = Array.from({ length: 42 * 42 }, () => offCell)

export const Pixelbots = (any) => {
  const [cells, setCells] = useState(initialCells)
  const [loading, setLoading] = useState(false)
  const [currentColor, setCurrentColor] = useState('#0FD698')
  const colorSwatch = useMemo(
    () => [
      ...Array.from(
        new Set(cells.filter((cell) => cell.on).map((cell) => cell.color))
      ),
    ],
    [cells]
  )
  const chatString = useMemo(
    () => cells.map((cell) => cell.color.slice(1)).join(','),
    [cells]
  )

  const save = function () {
    setLoading(true)
    var node = document.getElementById('my-node')
    var myCollection = document.getElementById('my-collection')
    var elements = node.children

    for (var i = 0; i < elements.length; i++) {
      //@ts-ignore
      elements[i].style.border = 'none'
      // elements[i].style.backgroundColor = '#0FD698'
    }
    domtoimage
      .toPng(node)
      .then(function (dataUrl) {
        // var img = new Image()
        var canvas = null
        var ctx = null

        var img = new Image()
        // img.setAttribute('src', dataUrl)
        img.src = dataUrl
        img.onload = function () {
          copyImageToCanvas(img)
          console.log('image', img)
          var dataURL = canvas.toDataURL('image/png')
          var img2 = new Image()
          img2.src = dataURL
          myCollection.appendChild(img2)
        }

      
        for (var i = 0; i < elements.length; i++) {
          //@ts-ignore
          elements[i].style.border = '.5px solid black'
        }
        setLoading(false)

        function copyImageToCanvas(aImg) {
          canvas = document.createElement('canvas')

          var w =
            typeof aImg.naturalWidth == 'undefined'
              ? aImg.width
              : aImg.naturalWidth
          var h =
            typeof aImg.naturalHeight == 'undefined'
              ? aImg.height
              : aImg.naturalHeight

          canvas.id = 'img' + 1
          canvas.width = w
          canvas.height = h

          // $this.replaceWith(canvas)

          ctx = canvas.getContext('2d')
          ctx.clearRect(0, 0, w, h)
          ctx.drawImage(aImg, 0, 0)

          makeTransparent(aImg)
         
        }

        function makeTransparent(aImg) {
          var w =
            typeof aImg.naturalWidth == 'undefined'
              ? aImg.width
              : aImg.naturalWidth
          var h =
            typeof aImg.naturalHeight == 'undefined'
              ? aImg.height
              : aImg.naturalHeight
          var imageData = ctx.getImageData(0, 0, w, h)
          console.log('imageData.widt', imageData.width)
          console.log('imageData.height', imageData.height)
          for (var x = 0; x < imageData.width; x++)
            for (var y = 0; y < imageData.height; y++) {
              var offset = (y * imageData.width + x) * 4
              var r = imageData.data[offset]
              var g = imageData.data[offset + 1]
              var b = imageData.data[offset + 2]

              //if it is pure white, change its alpha to 0
              if (r == 255 && g == 255 && b == 255)
                imageData.data[offset + 3] = 0
              imageData.data[offset] = 0
            }

          ctx.putImageData(imageData, 0, 0)
          return img
        }
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error)
        setLoading(false)
      })
  }

  const save_as_json = function () {
    console.log('save_as_json')
    var dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(cells))
    var dlAnchorElem = document.getElementById('downloadAnchorElem')
    dlAnchorElem.setAttribute('href', dataStr)
    dlAnchorElem.setAttribute('download', 'pixelbot.json')
    dlAnchorElem.click()
  }

  const apply = function () {
    var inputElem = document.getElementById('input')
    //@ts-ignore
    setCells(JSON.parse(inputElem.value))
  }

  return (
    <>
      <Section>
        <SectionHeader title='Pixelbots' subtitle='Alpha Testing Live Now!' />
        <Container maxWidth='md'>
          <Typography variant='body2' align='center' sx={{ pb: 6 }}>
            Attention: This a very early test and we will reset the chain
            somethimes.
          </Typography>
          <Typography variant='body1' align='center' sx={{ pb: 6 }}>
            Be creative!
          </Typography>
        </Container>
        <Container maxWidth='md'>
          <div>
            <ColorPicker
              currentColor={currentColor}
              onSetColor={setCurrentColor}
            />
            <div style={{ display: 'flex' }}>
              {colorSwatch.map((color) => (
                <div
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  style={{
                    background: color,
                    margin: '0.5rem',
                    padding: 0,
                    width: '25px',
                    height: '25px',
                    outline: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
            <Grid
              cells={cells}
              setCells={setCells}
              currentColor={currentColor}
            />
            <p
              style={{
                maxWidth: '50%',
                fontFamily: 'monospace',
                wordWrap: 'break-word',
              }}
            >
              {/* eslint-disable-next-line */}
              <Button disabled={loading} onClick={() => save()}>
                Save
              </Button>
              <Button disabled={loading} onClick={() => save_as_json()}>
                save_as_json
              </Button>
              <br />
              <div id='my-collection'></div>
              <a id='downloadAnchorElem' style={{ display: 'none' }}></a>
              <input id='input' />
              <Button disabled={loading} onClick={() => apply()}>
                apply
              </Button>
              {/* {chatString} */}
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default Pixelbots
