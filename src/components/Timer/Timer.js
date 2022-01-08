import { useState, useEffect } from "react"
const Timer = ({ turn, lastMove }) => {

  const [whiteTimer, setWhiteTimer] = useState(600)
  const [blackTimer, setBlackTimer] = useState(600)
  let displayedTimeWhite = Math.floor(whiteTimer / 60) + ':' + ('0' + Math.floor(whiteTimer % 60)).slice(-2)
  let displayedTimeBlack = Math.floor(blackTimer / 60) + ':' + ('0' + Math.floor(blackTimer % 60)).slice(-2)

  useEffect(() => {
    if (whiteTimer <= 0) {
      window.alert(`${turn === 'white' ? 'black' : 'white'} wins on time!!`)
    }
    if (blackTimer <= 0) {
      window.alert(`${turn === 'black' ? 'white' : 'black'} wins on time!!`)
    }
    if (lastMove) {
      if (whiteTimer > 0 && turn === 'white') {
        setTimeout(() => setWhiteTimer(whiteTimer - .1), 100);
      }
      if (blackTimer > 0 && turn === 'black') {
        setTimeout(() => setBlackTimer(blackTimer - .1), 100);
      }
    }
  }, [whiteTimer, blackTimer, turn]);

  return (
    <div>
      <div className='timer-component-black' style={{
        width: 100
      }}>
        <div className='timer-bar-black' style={{
          backgroundColor: "black"
        }}>
          <div className='timer-remainder-black' style={{
            textAlign: "right",
            color: "white",
            fontSize: 20
          }}>
            {displayedTimeBlack}
          </div>
        </div>
      </div>
      <div className='timer-component-white' style={{
        width: 100
      }}>
        <div className='timer-bar-white' style={{
          backgroundColor: "white"
        }}>
          <div className='timer-remainder-white' style={{
            textAlign: "right",
            fontSize: 20,
            marginBottom: 5
          }}>
            {displayedTimeWhite}
          </div>
        </div>
      </div>
    </div>
  )

}
export default Timer