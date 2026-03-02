import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  return (
    <div>
      <label>
        filter
        <input
          type="text"
          onChange={event => dispatch(filterChange(event.target.value))}
        />
      </label>
    </div>
  )
}

export default Filter
