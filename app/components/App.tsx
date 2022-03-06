import React, { FunctionComponent, useEffect, useState } from "react"
import MapCon from "./Map";
// import { LayerSwitch } from "./LayerSwitch";

export const App: FunctionComponent = () => {

  const [messagesFromExtension, setMessagesFromExtension] = useState<string[]>([])
  const [geojsonData, setGeojsonData] = useState<string>('')

  const handleMessagesFromExtension = (event: MessageEvent<string>) => {
    setGeojsonData(event.data)
  }

  useEffect(() => {
    window.addEventListener('message', (event: MessageEvent<string>) => {
      handleMessagesFromExtension(event)
    })
    return () => {
      window.removeEventListener('message', handleMessagesFromExtension)
    }
  }, [handleMessagesFromExtension])

  return (<div id="app">
    <MapCon geojson={geojsonData}/>
    {/* <LayerSwitch/> */}
    {/* <p>{ messagesFromExtension }</p> */}
    {/* <button onClick={ handleClick }>click</button> */}
  </div>)
}