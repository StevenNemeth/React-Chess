import { useState, useEffect } from "react"

const Timer = () => {

  const [whiteTimer, setWhiteTimer] = useState(600)
  const [blackTimer, setBlackTimer] = useState(600)
  let displayedTimeWhite = Math.floor(whiteTimer / 60) + ':' +('0'+Math.floor(whiteTimer % 60)).slice(-2)
  let displayedTimeBlack = Math.floor(blackTimer / 60) + ':' +('0'+Math.floor(blackTimer % 60)).slice(-2)

  // useEffect(() => {
  //   whiteTimer > 0 && setTimeout(() => setWhiteTimer(whiteTimer - 1), 1000);
  // }, [whiteTimer]);

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