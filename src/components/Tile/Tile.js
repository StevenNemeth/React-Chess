import './Tile.css'

const Tile = ({number, image, id}) => {
  if(number % 2 === 0){
    return <div className='tile black-tile'>
      {image && <div className='chess-piece' style={{backgroundImage: `url(${image})`}} id={id}></div>}
    </div>
  } else {
    return <div className='tile white-tile'>
      {image && <div className='chess-piece' style={{backgroundImage: `url(${image})`}} id={id}></div>}
      </div>
  }
}

export default Tile