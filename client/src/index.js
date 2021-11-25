import ReactDOM from 'react-dom'
import './index.css'
import App from './App.js'
import { unregister } from './serviceWorker.js'

// eslint-disable-next-line no-undef
ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister()
