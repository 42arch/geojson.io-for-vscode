import { GeoJsonGeometryTypes, GeoJsonProperties } from "geojson"
import React, { FunctionComponent } from "react"
import './PropsPopup.css'

interface IPorps {
	type: GeoJsonGeometryTypes,
	properties: GeoJsonProperties,
	updateFeature: (properties: GeoJsonProperties) => void,
	cancel: () => void
}

enum MarkerSymbol {
	default = '',
	circle = 'circle',
	circleStroked = 'circle-stroked',
	square = 'square',
	squareStroked = 'square-stroked',
	star = 'star',
	starStroked = 'star-stroked'
}

const SYMBOLLIST = [
	{ label: '', url: 'pin-m' },
	{ label: 'circle', url: 'pin-m-circle' },
	{ label: 'circle-stroked', url: 'pin-m-circle-stroked' },
	{ label: 'square', url: 'pin-m-square' },
	{ label: 'square-stroked', url: 'pin-m-square-stroked' },
	{ label: 'star', url: 'pin-m-star' },
	{ label: 'star-stroked', url: 'pin-m-star-stroked' },
	{ label: 'cross', url: 'pin-m-cross' }
]

const genDefaultProps = (type: GeoJsonGeometryTypes, props: GeoJsonProperties) => {
	switch (type) {
		case 'Point':
		case 'MultiPoint':
			const pointStyle = {
				'marker-color': '#555555',
				'marker-size': 'medium',
				'marker-symbol': ''
			}
			return Object.assign(pointStyle, props)
		case 'LineString':
		case 'MultiLineString':
			const lineStringStyle = {
				'stroke': '#555555',
				'stroke-width': 2,
				'stroke-opacity': 1
			}
			return Object.assign(lineStringStyle, props)
		case 'Polygon':
		case 'MultiPolygon':
			const polygonStyle = {
				'stroke': '#555555',
				'stroke-width': 2,
				'stroke-opacity': 1,
				'fill': '#555555',
				'fill-opacity': 0.5
			}
			return Object.assign(polygonStyle, props)
		default:
			return null
	}
}

const PropInput: FunctionComponent<{ keyStr: string, value: any, update:(key: string, value: any) => void }> = ({ keyStr, value, update }) => {
	if(['marker-color', 'stroke', 'fill'].includes(keyStr)) {
		return <input type="color" defaultValue={value} onChange={(e) => { update(keyStr, e.target.value) }}/>
	} else if (['stroke-width'].includes(keyStr)) {
		return <input type="number" defaultValue={value} min='0' onChange={(e) => { update(keyStr, e.target.value) }}/>
	} else if (['stroke-opacity', 'fill-opacity'].includes(keyStr)) {
		return <input type="number" defaultValue={value} max='1' min="0" step='0.1' onChange={(e) => { update(keyStr, e.target.value) }}/>
	} else if (['marker-size'].includes(keyStr)) {
		return <select defaultValue={value} onChange={(e) => { update(keyStr, e.target.value) }}>
			<option value="large">large</option>
			<option value="medium">medium</option>
			<option value="small">small</option>
		</select>
	} else if(['marker-symbol'].includes(keyStr)) {
		return (
			<select defaultValue={value} onChange={(e) => { update(keyStr, e.target.value) }}>
				{
					SYMBOLLIST.map(symbol => {
						return (
							<option key={symbol.label} value={symbol.label}>{ symbol.label }</option>
						)
					})
				}
			</select>
		)
	} else {
		return <input type="text" defaultValue={value} onChange={(e) => { update(keyStr, e.target.value) }}/>
	}
}

const PropsPopup: FunctionComponent<IPorps> = ({ type, properties, updateFeature, cancel }) => {

	const props = genDefaultProps(type, properties)

	const handleValueChange = (key: string, value: any) => {
		if(props) {
			props[key] = value	
		}
	}

	return (
		<div className="props-popup">
			<div className="props-info">
				<table>
					<tbody>
						{
							props && Object.keys(props).map(key => {
								return (
									<tr className="item-row" key={key}>
										<th>
											<input type="text" defaultValue={key} disabled />
										</th>
										<td>
											<PropInput keyStr={key} value={props[key]} update={(keyStr: string, value: any) => handleValueChange(keyStr, value)} />
										</td>
									</tr>
								)
							})
						}
					</tbody>
				</table>
			</div>

			<div className="btns">
				<button id="save-btn" onClick={(e) => { updateFeature(props) }}>Save</button>
				{/* <button id="cancel-btn" onClick={() => { cancel() }}>Cancel</button> */}
			</div>
		</div>
	)
}

export default PropsPopup