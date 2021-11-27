import './App.css';
import Chessboard from './components/Chessboard/Chessboard';
import Timer from './components/Timer/Timer'

const App = () => {
  return (
    <div id='app'>
      <Timer />
      <Chessboard />
      </div>
  )
}

export default App;
