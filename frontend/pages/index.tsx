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
  const [currentColor, setCurrentColor] = useState('#56BC58')
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
    }
    domtoimage
    .toPng(node)
    .then(function (dataUrl) {
      var img = new Image()
      img.src = dataUrl
      console.log('image', img)
      myCollection.appendChild(img)
      for (var i = 0; i < elements.length; i++) {
          //@ts-ignore
          elements[i].style.border = '.5px solid black'
        }
        setLoading(false)
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error)
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
              <a id="downloadAnchorElem" style={{display:'none'}}></a>
              <input id="input" />
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
