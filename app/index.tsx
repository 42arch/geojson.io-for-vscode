import React from 'react'
import ReactDOM from 'react-dom'
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
// import 'leaflet-draw/dist/leaflet.draw.css'
import "./index.scss"
import App from "./components/App"

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)