import React, { FunctionComponent, useEffect, useState } from "react"
import MapCon from "./Map";

export const App: FunctionComponent = () => {

  const [messagesFromExtension, setMessagesFromExtension] = useState<string[]>([])
  const [geojsonData, setGeojsonData] = useState<string>('')

  const handleMessagesFromExtension = (event: MessageEvent<string>) => {
    // if the data is empty, then create an empty feature collection.
    if(event.data === '') {
      const emptyFeatureCollection = {
        "type": "FeatureCollection",
        "features": []
      }
      setGeojsonData(JSON.stringify(emptyFeatureCollection))
      return
    }
    setGeojsonData(event.data)
  }

  useEffect(() => {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement
    if(canvas) {
      canvas.width=canvas. clientWidth*window.devicePixelRatio;
      canvas.height=canvas.clientHeight*window.devicePixelRatio; 
    }

    window.addEventListener('message', (event: MessageEvent<string>) => {
      handleMessagesFromExtension(event)
    })
    return () => {
      window.removeEventListener('message', handleMessagesFromExtension)
    }
  }, [handleMessagesFromExtension])

  return (
    <div id="app">
      <MapCon geojson={geojsonData}/>
    </div>
  )
}