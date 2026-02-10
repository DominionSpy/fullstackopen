import { useState } from 'react'

const Button = (props) => (
    <button onClick={props.onClick}>
        {props.text}
    </button>
)

const Statistics = ({good, neutral, bad}) => {
    const total = good + neutral + bad

    return (
        <p>
            good {good}<br />
            neutral {neutral}<br />
            bad {bad}<br />
            all {total}<br />
            average {(good - bad) / total}<br />
            positive {(good * 100) / total}%
        </p>
    )
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            <h1>give feedback</h1>
            <Button onClick={() => setGood(good + 1)} text='good' />
            <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
            <Button onClick={() => setBad(bad + 1)} text='bad' />
            <h1>statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App
