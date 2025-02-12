import { useStore } from './store'
import { PROJECTIONS } from '../utils/constant'
import './projection-switch.less'

function ProjectionSwitch() {
  const { projection, setProjection } = useStore()

  return (
    <div className="projection-switch">
      {PROJECTIONS.map((p) => (
        <button
          key={p.value}
          className={projection === p.value ? 'active' : ''}
          onClick={() => setProjection(p.value)}>
          {p.label}
        </button>
      ))}
    </div>
  )
}

export default ProjectionSwitch
