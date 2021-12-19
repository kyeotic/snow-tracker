export default function Snowfalls({ snowfalls = [] }) {
  return (
    <div className="snowfall">
      <h2>Snowfall</h2>
      <ul className="snowfalls">
        {snowfalls.map((s) => (
          <li key={s.since}>
            <span className="snowfall-depth">{s.depth}</span>{' '}
            <span className="snowfall-since">{s.since}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
