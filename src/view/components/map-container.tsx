import { useCallback, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDraw, { DrawCreateEvent } from '@mapbox/mapbox-gl-draw'
import { createRoot } from 'react-dom/client'
import { bbox } from '@turf/turf'
import { EditControl, SaveCancelControl, TrashControl } from '../utils/controls'
import PropsPopup from './props-popup'
import { useStore } from './store'
import ExtendDraw from '../utils/extend-draw'
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode'
import styles from '../utils/styles2'
import { DEFAULT_DARK_FEATURE_COLOR } from '../utils/constant'
import { FeatureCollection } from 'geojson'
import { nanoid } from 'nanoid'

function MapContainer() {
  const containerRef = useRef<HTMLDivElement>(null!)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const drawRef = useRef<MapboxDraw | null>(null)
  const editRef = useRef<EditControl | null>(null)
  const saveCancelRef = useRef<SaveCancelControl | null>(null)
  const trashRef = useRef<TrashControl | null>(null)
  const { geojson, setGeojson } = useStore()
  const latestGeojson = useRef<FeatureCollection | null>(null)

  useEffect(() => {
    latestGeojson.current = geojson

    console.log('geojson', geojson)
  }, [geojson])

  const handleEdit = () => {
    const map = mapRef.current
    drawRef.current?.changeMode('simple_select')

    map?.setLayoutProperty('map-data-fill', 'visibility', 'none')
    map?.setLayoutProperty('map-data-fill-outline', 'visibility', 'none')
    map?.setLayoutProperty('map-data-line', 'visibility', 'none')
    mapRef.current?.setLayoutProperty('map-data-point', 'visibility', 'none')

    saveCancelRef.current?.open()
    trashRef.current?.open()
    editRef.current?.close()

    if (latestGeojson.current) {
      drawRef.current?.add(latestGeojson.current)
    }
  }

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiaW5nZW40MiIsImEiOiJjazlsMnliMXoyMWoxM2tudm1hajRmaHZ6In0.rWx_wAz2cAeMIzxQQfPDPA'
    if (mapRef.current) {
      return
    }
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      center: [0, 0],
      zoom: 4,
      projection: 'mercator'
    })

    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      modes: {
        ...MapboxDraw.modes,
        // simple_select: SimpleSelect,
        // direct_select: MapboxDraw.modes.direct_select,
        static: StaticMode
      },
      controls: {},
      defaultMode: 'static',
      userProperties: true,
      styles: styles
    })
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
          title: 'Draw Point (m)'
        },
        {
          on: 'click',
          action: () => {
            draw.changeMode('draw_line_string')
          },
          classes: ['mapbox-gl-draw_ctrl-draw-btn', 'mapbox-gl-draw_line'],
          title: 'Draw LineString (l)'
        },
        {
          on: 'click',
          action: () => {
            draw.changeMode('draw_polygon')
          },
          classes: ['mapbox-gl-draw_ctrl-draw-btn', 'mapbox-gl-draw_polygon'],
          title: 'Draw Polygon (p)'
        },
        {
          on: 'click',
          action: () => {
            draw.changeMode('draw_rectangle')
          },
          classes: ['mapbox-gl-draw_ctrl-draw-btn', 'mapbox-gl-draw_rectangle'],
          title: 'Draw Rectangular Polygon (r)'
        },
        {
          on: 'click',
          action: () => {
            draw.changeMode('draw_circle')
          },
          classes: ['mapbox-gl-draw_ctrl-draw-btn', 'mapbox-gl-draw_circle'],
          title: 'Draw Circular Polygon (c)'
        }
      ]
    })

    mapRef.current.addControl(drawControl)
    // drawRef.current = draw

    editRef.current = new EditControl()
    mapRef.current.addControl(editRef.current, 'top-right')

    saveCancelRef.current = new SaveCancelControl()
    mapRef.current.addControl(saveCancelRef.current, 'top-right')

    trashRef.current = new TrashControl()
    mapRef.current.addControl(trashRef.current, 'top-right')

    editRef.current?.onClick(handleEdit)

    saveCancelRef.current.onCancelClick(() => {
      drawRef.current?.changeMode('static')
      saveCancelRef.current?.close()
      trashRef.current?.close()
      editRef.current?.open()
      drawRef.current?.deleteAll()

      mapRef.current?.setLayoutProperty(
        'map-data-fill',
        'visibility',
        'visible'
      )
      mapRef.current?.setLayoutProperty(
        'map-data-fill-outline',
        'visibility',
        'visible'
      )
      mapRef.current?.setLayoutProperty(
        'map-data-line',
        'visibility',
        'visible'
      )
      mapRef.current?.setLayoutProperty(
        'map-data-point',
        'visibility',
        'visible'
      )
    })

    saveCancelRef.current.onSaveClick(() => {
      drawRef.current?.changeMode('static')
      saveCancelRef.current?.close()
      trashRef.current?.close()
      editRef.current?.open()

      const features = drawRef.current?.getAll()

      if (features) {
        updateLayerData(features)
        setGeojson(features)
        postData(features)
      }

      drawRef.current?.deleteAll()

      mapRef.current?.setLayoutProperty(
        'map-data-fill',
        'visibility',
        'visible'
      )
      mapRef.current?.setLayoutProperty(
        'map-data-fill-outline',
        'visibility',
        'visible'
      )
      mapRef.current?.setLayoutProperty(
        'map-data-line',
        'visibility',
        'visible'
      )
      mapRef.current?.setLayoutProperty(
        'map-data-point',
        'visibility',
        'visible'
      )
    })

    trashRef.current.onClick(() => {
      drawRef.current?.trash()
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
              console.log('on save', id, properties)

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
          />
        )
      }
    })

    return () => {
      mapRef.current?.remove()
    }
  }, [])

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
      // vscode.postMessage({
      //   type: 'data',
      //   data: JSON.stringify(fc)
      // })
      drawRef.current?.deleteAll()
      drawRef.current?.changeMode('static')
    },
    [geojson, setGeojson]
  )

  useEffect(() => {
    const color = DEFAULT_DARK_FEATURE_COLOR

    mapRef.current?.on('idle', () => {
      if (!mapRef.current?.getSource('map-data')) {
        if (geojson) {
          // mapRef.current?.on('draw.create', created)

          const [minLng, minLat, maxLng, maxLat] = bbox(geojson)
          mapRef.current?.fitBounds([minLng, minLat, maxLng, maxLat], {
            padding: 10
          })

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
              'fill-opacity': ['coalesce', ['get', 'fill-opacity'], 0.3]
            },
            filter: ['==', ['geometry-type'], 'Polygon']
          })

          mapRef.current?.addLayer({
            id: 'map-data-fill-outline',
            type: 'line',
            source: 'map-data',
            paint: {
              'line-color': ['coalesce', ['get', 'stroke'], color],
              'line-width': ['coalesce', ['get', 'stroke-width'], 2],
              'line-opacity': ['coalesce', ['get', 'stroke-opacity'], 1]
            },
            filter: ['==', ['geometry-type'], 'Polygon']
          })

          mapRef.current?.addLayer({
            id: 'map-data-line',
            type: 'line',
            source: 'map-data',
            paint: {
              'line-color': ['coalesce', ['get', 'stroke'], color],
              'line-width': ['coalesce', ['get', 'stroke-width'], 2],
              'line-opacity': ['coalesce', ['get', 'stroke-opacity'], 1]
            },
            filter: ['==', ['geometry-type'], 'LineString']
          })

          mapRef.current?.addLayer({
            id: 'map-data-point',
            type: 'circle',
            source: 'map-data',
            paint: {
              'circle-color': ['coalesce', ['get', 'fill'], color],
              'circle-opacity': ['coalesce', ['get', 'fill-opacity'], 1],
              'circle-stroke-width': ['coalesce', ['get', 'stroke-width'], 1],
              'circle-stroke-color': [
                'coalesce',
                ['get', 'stroke-color'],
                '#ffffff'
              ]
            },
            filter: ['==', ['geometry-type'], 'Point']
          })
        }
      }
    })

    console.log('update geojson', geojson)

    if (mapRef.current?.isStyleLoaded()) {
      updateLayerData(geojson)
    }

    // const handleEdit = () => {
    //   if (geojson) {
    //     console.log('edit on click inner', geojson)
    //     drawRef.current?.add(geojson)
    //   }
    // }

    mapRef.current?.on('draw.create', created)

    return () => {
      mapRef.current?.off('draw.create', created)
      // editRef.current?.offClick()
    }
  }, [geojson])

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
