import './layer-switch.less'
import { useStore } from './store'
import { LAYER_STYLES } from '../utils/constant'

function LayerSwitch() {
  const { layerStyle, setLayerStyle } = useStore()

  return (
    <div className="layer-switch">
      {LAYER_STYLES.map((s) => (
        <button
          key={s.label}
          className={layerStyle.label === s.label ? 'active' : ''}
          onClick={() => setLayerStyle(s)}>
          {s.label}
        </button>
      ))}
    </div>
  )
}

export default LayerSwitch
