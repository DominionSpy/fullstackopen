const Persons = ({ persons, onDelete }) => (
  <>
    {persons.map(person =>
      <div key={person.id}>
        {person.name} {person.number}
        <button onClick={onDelete} value={person.id}>delete</button>
      </div>
    )}
  </>
)

export default Persons
