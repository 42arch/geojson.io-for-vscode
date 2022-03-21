import { GeoJsonGeometryTypes, GeoJsonProperties } from "geojson"
import React, { FunctionComponent, useEffect, useState } from "react"
import './PropsPopup.css'

interface IPorps {
	type: GeoJsonGeometryTypes,
	properties: GeoJsonProperties,
	updateFeature: (properties: GeoJsonProperties) => void,
	cancel: () => void
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

	const [styleShow, setStyleShow] = useState(true)
	const [hiddenProps, setHiddenProps] = useState([''])

	const handleStyleCheck = (show: boolean) => {
		const styleProps = ['marker-color', 'stroke', 'fill', 'stroke-width', 'stroke-opacity', 'fill-opacity', 'marker-size', 'marker-symbol']
		setStyleShow(!styleShow)
		if(show) {
			setHiddenProps([''])
		} else {
			setHiddenProps(styleProps)
		}
	}

	const [newRowList, setNewRowList] = useState<Array<{key: string, value: any}>>([])
	const addNewRow = () => {
		setNewRowList([...newRowList, { key: '', value: null }])
	}
	const handleNewRowValueChange = (idx: number, key: string, value: any) => {
		const row = newRowList[idx]
		if(value) {
			row.value = value
		}
		if(key) {
			row.key = key
		}
		newRowList.splice(idx, 1, row)
	}

	useEffect(() => {
		console.log('rowlist update', newRowList)
	}, [newRowList])

	const beforeUpdate = (props: GeoJsonProperties, newPropsList: Array<{key: string, value: any}>) => {
		newPropsList.forEach(item => {
			const newProp: GeoJsonProperties = {}
			newProp[item.key] = item.value
			if(item.key) {
				Object.assign(props, newProp)
			}
		})
		updateFeature(props)
	}

	return (
		<div className="props-popup">
			<div className="props-info">
				<table className="props-table">
					<tbody>
						{
							props && Object.keys(props).filter(key => (!hiddenProps.includes(key))).map(key => {
								return (
									<tr className="item-row" key={key}>
										<th>
											<input type="text" defaultValue={key} />
										</th>
										<td>
											<PropInput keyStr={key} value={props[key]} update={(keyStr: string, value: any) => handleValueChange(keyStr, value)} />
										</td>
									</tr>
								)
							})
						}
						{
							newRowList.map((row, idx) => {
								return (
									<tr className="item-row" key={idx}>
									<th>
										<input type="text" defaultValue={row.key} onChange={(e) => { handleNewRowValueChange(idx, e.target.value, row.value) }}/>
									</th>
									<td>
										<input type="text" defaultValue={row.key} onChange={(e) => { handleNewRowValueChange(idx, row.key, e.target.value) }}/>
										{/* <PropInput keyStr={row.key} value={row.value} update={(keyStr: string, value: any) => handleNewRowValueChange(idx, keyStr, value)} /> */}
									</td>
								</tr>
								)
							})
						}
					</tbody>
				</table>
				<div className="opt">
					<div id="add-row">
						<span onClick={addNewRow}>Add row</span>
					</div>
					<div id="show-style-props">
						<input type="checkbox" name="show-style" id="show-style" checked={styleShow} onChange={(e) => { handleStyleCheck(e.target.checked) }}/>
						<label htmlFor="show-style">Show style properties</label>
					</div>
				</div>
			</div>

			<div className="btns">
				<button id="save-btn" onClick={(e) => { beforeUpdate(props, newRowList) }}>Save</button>
				{/* <button id="cancel-btn" onClick={() => { cancel() }}>Cancel</button> */}
			</div>
		</div>
	)
}

export default PropsPopup