import { useState } from 'react'

const Button = (props) => (
    <button onClick={props.onClick}>
        {props.text}
    </button>
)

const StatisticsLine = ({ text, value, percentage = false}) => (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
        {percentage ? <td>%</td> : ''}
    </tr>
)

const Statistics = ({good, neutral, bad}) => {
    const total = good + neutral + bad

    if (total === 0) {
        return (
            <p>No feedback given</p>
        )
    }
    return (
        <table>
            <tbody>
                <StatisticsLine text='good' value={good} />
                <StatisticsLine text='neutral' value={neutral} />
                <StatisticsLine text='bad' value={bad} />
                <StatisticsLine text='all' value={total} />
                <StatisticsLine text='average' value={(good - bad) / total} />
                <StatisticsLine text='positive' value={(good * 100) / total} percentage />
            </tbody>
        </table>
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
