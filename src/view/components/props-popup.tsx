import { useEffect, useState } from 'react'
import { GeoJSONFeature } from 'mapbox-gl'
import './props-popup.less'

interface Props {
  data: GeoJSONFeature
  onSave: (
    id: string | number | undefined,
    properties: GeoJSONFeature['properties']
  ) => void
}

// properties table
function PropertiesTable({
  properties,
  onChange
}: {
  properties: GeoJSONFeature['properties']
  onChange: (properties: GeoJSONFeature['properties']) => void
}) {
  const [rowList, setRowList] = useState<{ key: string; value: string }[]>([])

  useEffect(() => {
    if (properties) {
      const rows = Object.keys(properties).map((key) => ({
        key,
        value: properties[key]
      }))
      setRowList(rows)
    }
  }, [properties])

  const addNewRow = () => {
    setRowList((prev) => [...prev, { key: '', value: '' }])
  }

  const handleRowUpdate = (index: number, key: string, value: string) => {
    const row = rowList[index]

    row.key = key
    row.value = value
    if (row.key) {
      rowList.splice(index, 1, row)
    } else {
      rowList.splice(index, 1)
    }
    // rowList.reduce((acc, cur) => {
    //   return cur.key ? { ...acc, [cur.key]: cur.value } : acc
    // }, {})
    setRowList([...rowList])

    console.log('row list change', key, value, rowList)

    onChange(
      rowList.reduce((acc, cur) => {
        return cur.key ? { ...acc, [cur.key]: cur.value } : acc
      }, {})
    )
  }

  return (
    <div className="properties-table">
      <table className="table">
        <tbody>
          {rowList.length ? (
            rowList
              .filter((row) => row.key !== '_id')
              .map((row, index) => (
                <tr className="item-row" key={index}>
                  <td>
                    <input
                      type="text"
                      defaultValue={row.key}
                      onChange={(e) => {
                        handleRowUpdate(index, e.target.value, row.value)
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={row.value}
                      onChange={(e) => {
                        handleRowUpdate(index, row.key, e.target.value)
                      }}
                    />
                  </td>
                </tr>
              ))
          ) : (
            <tr className="item-row">
              <td>
                <input type="text" />
              </td>
              <td>
                <input type="text" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="props-opts">
        <div id="add-row">
          <span onClick={addNewRow}>
            {' '}
            <span style={{ fontSize: '18px', fontWeight: 800 }}> + </span>
            Add row
          </span>
        </div>
        <div id="show-style-props">
          <input
            type="checkbox"
            name="show-style"
            id="show-style"
            // checked={styleShow}
            onChange={(e) => {
              // handleStyleCheck(e.target.checked)
            }}
          />
          <label htmlFor="show-style">Show style properties</label>
        </div>
      </div>
    </div>
  )
}

function InfoTable() {
  return <div></div>
}

function PropsPopup({ data, onSave }: Props) {
  console.log('PropsPopup data', data)

  const [activeTab, setActiveTab] = useState<'properties' | 'info'>(
    'properties'
  )

  const [properties, setProperties] = useState<GeoJSONFeature['properties']>(
    data.properties
  )

  useEffect(() => {}, [activeTab])

  const handleChange = (properties: GeoJSONFeature['properties']) => {
    console.log('handleChange xxxx', properties)
    setProperties(properties)
  }

  const handleSave = () => {
    console.log('save props', data.id, properties)
    onSave(data.id, properties)
  }

  return (
    <div className="props-popup">
      <div className="content">
        {activeTab === 'properties' ? (
          <PropertiesTable properties={properties} onChange={handleChange} />
        ) : (
          <InfoTable />
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
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default PropsPopup
