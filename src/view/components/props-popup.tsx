import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { GeoJSONFeature } from 'mapbox-gl'
import { GeoJsonGeometryTypes } from 'geojson'
import {
  DEFAULT_FILL_STYLE_ROWS,
  DEFAULT_LINE_STYLE_ROWS,
  DEFAULT_POINT_STYLE_ROWS,
  STYLE_FIELDS
} from '../utils/constant'
import measure from '../utils/measure'
import { Row } from '../utils/types'
import './props-popup.less'

interface Props {
  data: GeoJSONFeature
  onSave: (
    id: string | number | undefined,
    properties: GeoJSONFeature['properties']
  ) => void
  onCancel: () => void
}

// Value Input
const ValueInput = forwardRef<
  HTMLInputElement,
  {
    field: string
    value: string | number
    onChange: (value: string | number) => void
  }
>(({ field, value, onChange }, ref) => {
  switch (field) {
    case 'stroke':
    case 'fill':
      return (
        <input
          type="color"
          defaultValue={value}
          ref={ref}
          onChange={(e) => {
            onChange(e.target.value)
          }}
        />
      )
    case 'stroke-width':
      return (
        <input
          type="number"
          min="0"
          defaultValue={value}
          ref={ref}
          onChange={(e) => {
            onChange(e.target.valueAsNumber)
          }}
        />
      )
    case 'stroke-opacity':
    case 'fill-opacity':
      return (
        <input
          type="number"
          min={0}
          max={1}
          step={0.1}
          defaultValue={value}
          ref={ref}
          onChange={(e) => {
            onChange(e.target.valueAsNumber)
          }}
        />
      )
    default:
      return (
        <input
          type="text"
          defaultValue={value}
          ref={ref}
          onChange={(e) => {
            onChange(e.target.value)
          }}
        />
      )
  }
})

// Properties Table
function PropertiesTable({
  type,
  rowList,
  onChange
}: {
  type: GeoJsonGeometryTypes
  rowList: Row[]
  onChange: (rowList: Row[]) => void
}) {
  useEffect(() => {
    onChange(rowList)
  }, [rowList])

  const rowRefs = useRef<
    { key: HTMLInputElement | null; value: HTMLInputElement | null }[]
  >([])

  const addNewRow = () => {
    const newRowList = [...rowList, { field: '', value: '' }]
    onChange(newRowList)
  }

  const addStyleProperties = () => {
    const newRowList = addStyleRows(type, rowList)
    onChange(newRowList)
  }

  const handleChange = (
    index: number,
    field: 'field' | 'value',
    newValue: string | number
  ) => {
    const newRowList = [...rowList]
    newRowList[index] = {
      ...newRowList[index],
      [field]: newValue
    }
    onChange(newRowList)
  }

  return (
    <div className="properties-table">
      <table className="table">
        <tbody>
          {rowList
            .filter((row) => row.field !== '_id')
            .map((row, index) => (
              <tr className="item-row" key={index}>
                <td>
                  <input
                    type="text"
                    defaultValue={row.field}
                    ref={(el) =>
                      (rowRefs.current[index] = {
                        ...rowRefs.current[index],
                        key: el
                      })
                    }
                    onChange={(e) => {
                      handleChange(index, 'field', e.target.value)
                    }}
                  />
                </td>
                <td>
                  <ValueInput
                    field={row.field}
                    value={row.value}
                    ref={(el) =>
                      (rowRefs.current[index] = {
                        ...rowRefs.current[index],
                        value: el
                      })
                    }
                    onChange={(v) => {
                      handleChange(index, 'value', v)
                    }}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="props-opts">
        <div id="add-row">
          <span onClick={addNewRow}>
            <span style={{ fontSize: '18px', fontWeight: 800 }}> + </span>
            Add row
          </span>
        </div>
        {!STYLE_FIELDS.every((field) =>
          rowList.map((r) => r.field).includes(field)
        ) && (
          <span id="add-style-props" onClick={addStyleProperties}>
            Add style properties
          </span>
        )}
      </div>
    </div>
  )
}

// Measure Info Table
function InfoTable({ data }: { data: GeoJSONFeature }) {
  const info = measure(data)

  return (
    <div className="properties-table">
      <table className="table">
        <tbody>
          {Object.keys(info).map((field, index) => (
            <tr className="item-row" key={index}>
              <td>
                <input type="text" defaultValue={field} disabled />
              </td>
              <td>
                <input type="number" defaultValue={info[field]} disabled />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PropsPopup({ data, onSave, onCancel }: Props) {
  const [activeTab, setActiveTab] = useState<'properties' | 'info'>(
    'properties'
  )

  const id = useMemo(() => {
    return data.properties ? data.properties['_id'] : ''
  }, [data])

  const [rowList, setRowList] = useState<Row[]>([])

  useEffect(() => {
    if (data.properties) {
      const keys = Object.keys(data.properties).filter((key) => key !== '_id')
      if (keys.length) {
        setRowList(
          keys.map((key) => ({
            field: key,
            value: data.properties ? data.properties[key] : ''
          }))
        )
      } else {
        setRowList([{ field: '', value: '' }])
      }
    } else {
      setRowList([{ field: '', value: '' }])
    }
  }, [data])

  const handleSave = useCallback(() => {
    const properties = rowList.reduce((acc, cur) => {
      return cur.field ? { ...acc, [cur.field]: cur.value } : acc
    }, {})

    onSave(id, {
      ...properties,
      _id: id
    })
  }, [id, onSave, rowList])

  return (
    <div className="props-popup">
      <div className="content">
        {activeTab === 'properties' ? (
          <PropertiesTable
            type={data.geometry.type}
            rowList={rowList}
            onChange={(rowList) => {
              setRowList(rowList)
            }}
          />
        ) : (
          <InfoTable data={data} />
        )}
      </div>
      <div className="footer">
        <div className="tabs">
          <div
            className={`tab_item ${activeTab === 'properties' && 'active'}`}
            onClick={() => setActiveTab('properties')}>
            Properties
          </div>
          <div
            className={`tab_item ${activeTab === 'info' && 'active'}`}
            onClick={() => setActiveTab('info')}>
            Info
          </div>
        </div>
        <div className="opts">
          <div className="btns">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropsPopup

function addStyleRows(type: GeoJsonGeometryTypes, rowList: Row[]) {
  const mergeRowList = (rowList: Row[], styleRowList: Row[]) => {
    const merged = [...rowList.filter((r) => r.field)]
    styleRowList.forEach((row) => {
      const exist = merged.find((r) => r.field === row.field)
      if (!exist) {
        merged.push(row)
      }
    })
    return merged
  }

  switch (type) {
    case 'Point':
    case 'MultiPoint':
      return mergeRowList(rowList, DEFAULT_POINT_STYLE_ROWS)
    case 'LineString':
    case 'MultiLineString':
      return mergeRowList(rowList, DEFAULT_LINE_STYLE_ROWS)
    case 'Polygon':
    case 'MultiPolygon':
      return mergeRowList(rowList, DEFAULT_FILL_STYLE_ROWS)
    default:
      return [...rowList]
  }
}
