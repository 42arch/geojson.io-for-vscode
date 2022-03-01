import React, { useCallback, useEffect, useState } from "react"
import MapCon from "./Map";
import { LayerSwitch } from "./LayerSwitch";

export const App = () => {

  const [messagesFromExtension, setMessagesFromExtension] = useState<string[]>([])
  const [geojsonData, setGeojsonData] = useState<string>('')

  // const handleMessagesFromExtension = useCallback((event: MessageEvent<string>) => {
  //   console.log(`message From extension: ${event.data}`)
  //   n++
  //   console.log(n)
  //   setMessagesFromExtension([event.data])
  // }, [messagesFromExtension])

    const handleMessagesFromExtension = (event: MessageEvent<string>) => {
      console.log(`message From extension: ${event}`)
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


  const handleClick = () => {
    console.log('clicked')
  }

  return (<div id="app">
    <MapCon geojson={geojsonData}/>
    {/* <LayerSwitch/> */}
    {/* <p>{ messagesFromExtension }</p> */}
    {/* <button onClick={ handleClick }>click</button> */}
  </div>)
}