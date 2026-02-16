import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [successful, setSuccessful] = useState(true)

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons
      .map(person => person.name)
      .indexOf(newName) !== -1) {
      const personObject = persons.find(person => person.name === newName)
      if (window.confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(personObject.id, {...personObject, number: newNumber})
          .then(returnedPerson => {
            setMessage(
              `Updated ${personObject.name}`
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setPersons(persons.toSpliced(persons.indexOf(personObject), 1, returnedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setMessage(
              `Information of ${personObject.name} has already been removed from server`
            )
            setSuccessful(false)
            setTimeout(() => {
              setMessage(null)
              setSuccessful(true)
            }, 5000)
            setPersons(persons.filter(n => n.id !== personObject.id))
          })
      }
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
    personService
      .create(personObject)
      .then(returnedPerson => {
        setMessage(
          `Added ${returnedPerson.name}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (event) => {
    const personObject = persons.find(person => person.id === event.target.value)
    if (window.confirm(`Delete ${personObject.name} ?`)) {
      personService
        .remove(personObject.id)
        .then(returnedPerson => {
          console.log(returnedPerson)
          setPersons(persons.filter(person => person.id !== returnedPerson.id))
        })
        .catch(error => {
          setMessage(
            `Information of ${personObject.name} has already been removed from server`
          )
          setSuccessful(false)
          setTimeout(() => {
            setMessage(null)
            setSuccessful(true)
          }, 5000)
          setPersons(persons.filter(n => n.id !== personObject.id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const personsToShow = nameFilter === ''
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(nameFilter.toLowerCase())
    )

  return (
    <div>
      <Notification message={message} successful={successful} />
      <h2>Phonebook</h2>
      <Filter value={nameFilter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        onNameChange={handleNameChange}
        numberValue={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons
        persons={personsToShow}
        onDelete={deletePerson}
      />
    </div>
  )
}

export default App
