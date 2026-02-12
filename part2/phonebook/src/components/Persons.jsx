const Persons = ({persons}) => (
  <>
    {persons.map(person =>
      <div key={person.id}>{person.name} {person.number}<br /></div>
    )}
  </>
)

export default Persons
