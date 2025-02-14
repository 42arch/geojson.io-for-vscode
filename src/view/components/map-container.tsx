import { useCallback, useEffect, useRef } from 'react'
import mapboxgl, { NavigationControl } from 'mapbox-gl'
import MapboxDraw, { DrawCreateEvent } from '@mapbox/mapbox-gl-draw'
import { createRoot } from 'react-dom/client'
import { bbox } from '@turf/turf'
import { FeatureCollection } from 'geojson'
import { nanoid } from 'nanoid'
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode'
import PropsPopup from './props-popup'
import { useStore } from './store'
import {
  EditControl,
  SaveCancelControl,
  TrashControl
} from '../utils/draw/controls'
import ExtendDraw from '../utils/draw/extend-draw'
import DrawRectangle from '../utils/draw/rectangle'
import DrawCircle from '../utils/draw/circle'
import styles from '../utils/styles'
import {
  ACCESS_TOKEN,
  DEFAULT_FILL_COLOR,
  DEFAULT_FILL_OPACITY,
  DEFAULT_STROKE_OPACITY,
  DEFAULT_STROKE_WIDTH,
  LAYER_STYLES,
  PROJECTIONS
} from '../utils/constant'

function MapContainer() {
  const containerRef = useRef<HTMLDivElement>(null!)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const drawRef = useRef<MapboxDraw | null>(null)
  const drawControlRef = useRef<ExtendDraw | null>(null)
  const editRef = useRef<EditControl | null>(null)
  const saveCancelRef = useRef<SaveCancelControl | null>(null)
  const trashRef = useRef<TrashControl | null>(null)
  const { geojson, setGeojson, projection, layerStyle } = useStore()
  const latestGeojson = useRef<FeatureCollection | null>(null)

  useEffect(() => {
    latestGeojson.current = geojson
  }, [geojson])

  const handleEditStart = () => {
    drawRef.current?.changeMode('simple_select')
    toggleMapData('none')

    saveCancelRef.current?.open()
    trashRef.current?.open()
    editRef.current?.close()
    drawControlRef.current?.close()

    if (latestGeojson.current) {
      drawRef.current?.add(latestGeojson.current)
    }
  }

  const handleEditCancel = () => {
    drawRef.current?.changeMode('static')
    saveCancelRef.current?.close()
    trashRef.current?.close()
    editRef.current?.open()
    drawControlRef.current?.open()
    drawRef.current?.deleteAll()
    toggleMapData('visible')
  }

  const handleEditSave = () => {
    drawRef.current?.changeMode('static')
    saveCancelRef.current?.close()
    trashRef.current?.close()
    editRef.current?.open()
    drawControlRef.current?.open()
    const features = drawRef.current?.getAll()
    if (features) {
      updateLayerData(features)
      setGeojson(features)
      postData(features)
    }

    drawRef.current?.deleteAll()
    toggleMapData('visible')
  }

  const addMapData = (geojson: FeatureCollection) => {
    const color = DEFAULT_FILL_COLOR

    mapRef.current?.addSource('map-data', {
      type: 'geojson',
      data: geojson,
      promoteId: '_id'
    })

    mapRef.current?.addLayer({
      id: 'map-data-fill',
      type: 'fill',
      source: 'map-data',
      paint: {
        'fill-color': ['coalesce', ['get', 'fill'], color],
        'fill-opacity': [
          'coalesce',
          ['get', 'fill-opacity'],
          DEFAULT_FILL_OPACITY
        ]
      },
      filter: ['==', ['geometry-type'], 'Polygon']
    })

    mapRef.current?.addLayer({
      id: 'map-data-fill-outline',
      type: 'line',
      source: 'map-data',
      paint: {
        'line-color': ['coalesce', ['get', 'stroke'], color],
        'line-width': [
          'coalesce',
          ['get', 'stroke-width'],
          DEFAULT_STROKE_WIDTH
        ],
        'line-opacity': [
          'coalesce',
          ['get', 'stroke-opacity'],
          DEFAULT_STROKE_OPACITY
        ]
      },
      filter: ['==', ['geometry-type'], 'Polygon']
    })

    mapRef.current?.addLayer({
      id: 'map-data-line',
      type: 'line',
      source: 'map-data',
      paint: {
        'line-color': ['coalesce', ['get', 'stroke'], color],
        'line-width': [
          'coalesce',
          ['get', 'stroke-width'],
          DEFAULT_STROKE_WIDTH
        ],
        'line-opacity': [
          'coalesce',
          ['get', 'stroke-opacity'],
          DEFAULT_STROKE_OPACITY
        ]
      },
      filter: ['==', ['geometry-type'], 'LineString']
    })

    mapRef.current?.addLayer({
      id: 'map-data-point',
      type: 'circle',
      source: 'map-data',
      paint: {
        'circle-color': ['coalesce', ['get', 'fill'], color],
        'circle-opacity': [
          'coalesce',
          ['get', 'fill-opacity'],
          DEFAULT_FILL_OPACITY
        ],
        'circle-stroke-width': [
          'coalesce',
          ['get', 'stroke-width'],
          DEFAULT_STROKE_WIDTH
        ],
        'circle-stroke-color': ['coalesce', ['get', 'stroke'], '#ffffff']
      },
      filter: ['==', ['geometry-type'], 'Point']
    })
  }

  const toggleMapData = (visibility: 'visible' | 'none') => {
    const map = mapRef.current
    map?.setLayoutProperty('map-data-fill', 'visibility', visibility)
    map?.setLayoutProperty('map-data-fill-outline', 'visibility', visibility)
    map?.setLayoutProperty('map-data-line', 'visibility', visibility)
    map?.setLayoutProperty('map-data-point', 'visibility', visibility)
  }

  const created = useCallback(
    (e: DrawCreateEvent) => {
      if (!geojson || !mapRef.current) {
        return
      }
      const fc = geojson
      e.features.forEach((feature) => {
        feature.properties = {
          ...feature.properties,
          _id: nanoid()
        }
      })
      fc.features = [...fc.features, ...e.features]

      if (!fc) {
        return
      }

      updateLayerData(fc)
      setGeojson(fc)
      postData(fc)
      drawRef.current?.deleteAll()
      drawRef.current?.changeMode('static')
    },
    [geojson, setGeojson]
  )

  useEffect(() => {
    mapboxgl.accessToken = ACCESS_TOKEN
    if (mapRef.current) {
      return
    }
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      center: [0, 0],
      zoom: 1,
      style: LAYER_STYLES[0].style,
      projection: PROJECTIONS[0].value
    })

    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      modes: {
        ...MapboxDraw.modes,
        // simple_select: SimpleSelect,
        // direct_select: MapboxDraw.modes.direct_select,
        draw_rectangle: DrawRectangle,
        draw_circle: DrawCircle,
        static: StaticMode
      },
      controls: {},
      defaultMode: 'static',
      userProperties: true,
      styles: styles
    })

    mapRef.current.addControl(new NavigationControl(), 'top-right')

    const draw = drawRef.current
    const drawControl = new ExtendDraw({
      draw: draw,
      buttons: [
        {
          on: 'click',
          action: () => {
            // drawing = true
            draw.changeMode('draw_point')
          },
          classes: ['mapbox-gl-draw_ctrl-draw-btn', 'mapbox-gl-draw_point'],
          title: 'Draw Point'
        },
        {
          on: 'click',
          action: () => {
            draw.changeMode('draw_line_string')
          },
          classes: ['mapbox-gl-draw_ctrl-draw-btn', 'mapbox-gl-draw_line'],
          title: 'Draw LineString'
        },
        {
          on: 'click',
          action: () => {
            draw.changeMode('draw_polygon')
          },
          classes: ['mapbox-gl-draw_ctrl-draw-btn', 'mapbox-gl-draw_polygon'],
          title: 'Draw Polygon'
        },
        {
          on: 'click',
          action: () => {
            draw.changeMode('draw_rectangle')
          },
          classes: ['mapbox-gl-draw_ctrl-draw-btn', 'mapbox-gl-draw_rectangle'],
          title: 'Draw Rectangular Polygon'
        },
        {
          on: 'click',
          action: () => {
            draw.changeMode('draw_circle')
          },
          classes: ['mapbox-gl-draw_ctrl-draw-btn', 'mapbox-gl-draw_circle'],
          title: 'Draw Circular Polygon'
        }
      ]
    })
    drawControlRef.current = drawControl
    mapRef.current.addControl(drawControl)

    editRef.current = new EditControl()
    mapRef.current.addControl(editRef.current, 'top-right')

    saveCancelRef.current = new SaveCancelControl()
    mapRef.current.addControl(saveCancelRef.current, 'top-right')

    trashRef.current = new TrashControl()
    mapRef.current.addControl(trashRef.current, 'top-right')

    editRef.current?.onClick(handleEditStart)

    saveCancelRef.current.onCancelClick(handleEditCancel)

    saveCancelRef.current.onSaveClick(handleEditSave)

    trashRef.current.onClick(() => {
      drawRef.current?.trash()

      console.log('trash', geojson, latestGeojson.current)
    })

    mapRef.current.on('click', (e) => {
      const features = mapRef.current?.queryRenderedFeatures(e.point, {
        layers: ['map-data-point', 'map-data-line', 'map-data-fill']
      })

      if (features && features.length > 0) {
        const popupNode = document.createElement('div')

        const popup = new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setDOMContent(popupNode)
          .addTo(mapRef.current!)

        createRoot(popupNode).render(
          <PropsPopup
            data={features[0]}
            onSave={(id, properties) => {
              latestGeojson.current?.features.forEach((feature) => {
                if (feature.properties && feature.properties['_id'] === id) {
                  feature.properties = properties
                }
              })
              if (latestGeojson.current) {
                setGeojson(latestGeojson.current)
              }
              updateLayerData(latestGeojson.current)
              postData(latestGeojson.current)
              popup.remove()
            }}
            onCancel={() => popup.remove()}
          />
        )
      }
    })

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    mapRef.current?.on('idle', () => {
      if (!mapRef.current?.getSource('map-data')) {
        if (latestGeojson.current) {
          const [minLng, minLat, maxLng, maxLat] = bbox(latestGeojson.current)
          mapRef.current?.fitBounds([minLng, minLat, maxLng, maxLat], {
            padding: 10
          })
          addMapData(latestGeojson.current)
        }
      }
    })

    if (mapRef.current?.isStyleLoaded()) {
      updateLayerData(latestGeojson.current)
    }

    mapRef.current?.on('draw.create', created)

    return () => {
      mapRef.current?.off('draw.create', created)
    }
  }, [geojson])

  useEffect(() => {
    mapRef.current?.setProjection(projection)
  }, [projection])

  useEffect(() => {
    mapRef.current?.setStyle(layerStyle.style)
  }, [layerStyle])

  const updateLayerData = (geojson: FeatureCollection | null) => {
    if (!geojson || !mapRef.current) {
      return
    }

    const source = mapRef.current.getSource(
      'map-data'
    ) as mapboxgl.GeoJSONSource

    if (source) {
      source.setData(geojson)
    }
  }

  return (
    <div
      ref={containerRef}
      id="map-container"
      style={{ height: '100%', width: '100%' }}
    />
  )
}

export default MapContainer

function postData(fc: FeatureCollection | null) {
  if (!fc) {
    return
  }
  const newFc = {
    ...fc,
    features: fc.features.map((f) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...rest } = { ...f.properties }
      return {
        ...f,
        properties: rest
      }
    })
  }

  vscode.postMessage({
    type: 'data',
    data: JSON.stringify(newFc)
  })
}
