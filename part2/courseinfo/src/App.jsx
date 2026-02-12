const Header = (props) => <h1>{props.course}</h1>

const Content = ({ parts }) => (
  <div>
    {parts.map(part =>
      <Part key={part.id} part={part} />
    )}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Course = ({ course }) => {
  return (
    <>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
    </>
  )
}

const Total = (props) => <p>Number of exercises {props.total}</p>

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        id: 1,
        name: 'Fundamentals of React',
        exercises: 10,
      },
      {
        id: 2,
        name: 'Using props to pass data',
        exercises: 7,
      },
      {
        id: 3,
        name: 'State of a component',
        exercises: 14,
      },
      {
        id: 4,
        name: 'Foo and bar',
        exercises: 8,
      },
    ],
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App
