import React from 'react'
import ReactDOM from 'react-dom'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import "./index.css"
import { App } from "./components/App"

ReactDOM.render(
    <App/>,
  document.getElementById('root'))