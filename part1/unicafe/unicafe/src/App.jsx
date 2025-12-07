import { useState } from 'react'

const Statistics = (props) => {
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine category="good" value={props.goodState} />
          <StatisticLine category="neutral" value={props.neutralState} />
          <StatisticLine category="bad" value={props.badState} />
          <StatisticLine category="all" value={props.all} />
          <StatisticLine category="average" value={props.average} />
          <StatisticLine category="positive" value={props.positive} />
        </tbody>
      </table>
    </div>
  );
};

const StatisticLine = ({ category, value }) => {
  return (
    <tr>
      <td>{category}</td>
      <td>{value}</td>
    </tr>
  );
};

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const states = { 
    goodState: good, 
    neutralState: neutral, 
    badState: bad,
    all: good + neutral + bad,
    average: (good - bad) / (good + neutral + bad),
    positive: ( ( (good) / (good + neutral + bad) ) * 100 ).toFixed(1) + '%'
  }

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>

      {/* FIX HERE */}
      <Statistics {...states} />
    </div>
  )
}

export default App