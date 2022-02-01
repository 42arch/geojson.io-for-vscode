import React, { useCallback, useEffect, useState } from "react"


export const App = () => {

  const [messagesFromExtension, setMessagesFromExtension] = useState<string[]>([])
  
  const handleMessagesFromExtension = useCallback((event: MessageEvent<string>) => {
    console.log(`message From extension: ${event.data}`)
    setMessagesFromExtension([event.data])
  }, [messagesFromExtension])

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

  return (<div>
    <p>hello world</p>

    <p>{ messagesFromExtension }</p>

    <button onClick={ handleClick }>click</button>
  </div>)
}