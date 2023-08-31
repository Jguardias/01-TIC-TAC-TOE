import { useState, useEffect } from 'react';
import { Square } from './components/Square';
import { SquareTurn} from './components/SquareTurn'
import { calculateWinner } from './logic/constants';
import style from './styles/Game.module.css'
import ReactAudioPlayer from 'react-audio-player';
import wonderlandAudio from './assets/Wonderland.ogg';
import clickSound from  './assets/sound.mp3';
import winnerSound from  './assets/SondWinner.mp3';
import confetti from 'canvas-confetti';
import rutaVideo from '../src/assets/Background.mp4';
import io from 'socket.io-client'



const  socket = io('/');

const PLAYERS ={
  X: <img src="../src/assets/x.png" alt="Player X" className={style.PlayerIcon} />,
  O: <img src="../src/assets/o.png" alt="Player X" className={style.PlayerIcon}/>
}

function Board(){

  const [xIsNext,setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isMuted, setIsMuted] = useState(false);
  const [winnerSoundPlayed, setWinnerSoundPlayed] = useState(false); 
  const [filledBarrTime,setFilledBarrTime] = useState(100)
  const [colorBarrTime, setColorBarrTime] = useState('green')
  const [hasExecutedIsUpTime, setHasExecutedIsUpTime] = useState(false)
 

  
  const Childdiv = {
    height: '100%',
    width: `${filledBarrTime}%`,
    backgroundColor:colorBarrTime,
   borderRadius:40,
    textAlign: 'right'
    
  }
  
  useEffect(() => {
    socket.on("mensaje", (data) => {
      console.log(`Movimiento del oponente: Casilla ${data.position} - Jugador ${data.player}`);
      // Actualizar el estado del juego en el cliente según el movimiento recibido
      const nextSquares = squares.slice();
      nextSquares[data.position] = data.player;
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
    });
  }, [squares, xIsNext]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFilledBarrTime(prevProgress => {
        const newProgress = Math.max(prevProgress - 10, 0);
        if (newProgress > 70) {
          setColorBarrTime('green');
        } else if (newProgress > 30) {
        setColorBarrTime('orange');
        } else if(newProgress > 10) {
          setColorBarrTime('red');
        } else{
          setFilledBarrTime(100);
          setColorBarrTime('green');
          setHasExecutedIsUpTime(true)
        }
  
        return newProgress; 
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasExecutedIsUpTime) {
      setXIsNext(!xIsNext); 
      setHasExecutedIsUpTime(false);
    }
  },[hasExecutedIsUpTime,setXIsNext]);

function  timeBarrReset(){
    setFilledBarrTime(100);
    setColorBarrTime('green');
    setHasExecutedIsUpTime(false);
  }
 function playSound  (link){
  if (!isMuted) {
    const audio = new Audio(link);
    audio.play();
  }
  }

  function toggleMute(){
    setIsMuted(!isMuted);
  }

  function hardleClick(i){
    if(squares[i] || calculateWinner(squares)){
      return; 
    }

    const nextSquares = squares.slice();
    xIsNext ? nextSquares[i] = PLAYERS.X : nextSquares[i] = PLAYERS.O;
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    playSound(clickSound);
    socket.emit('mensaje',  { position: i, player: xIsNext ? PLAYERS.X : PLAYERS.O });
    timeBarrReset()
  }



  function hardleReset(){
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinnerSoundPlayed(false); 
   
  }



  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    if (!winnerSoundPlayed) {
      confetti()
      playSound(winnerSound);
      setWinnerSoundPlayed(true);
    }
    status = "Winner: " + winner;
  } else {
    status = "Next Player: " + (xIsNext ? "Norbit" : "Aurora");
  }
  return (
    <main className={style.Game}> 
      <div className={style.Contenedor}>
  
      <header className={style.Header}>
       <div className={style.ParentBarrTime}>
           <div style={Childdiv}>
            <span className={style.BarrTimetext}>{`time`}</span>
          </div>
        </div>
      </header>
      {/* <div className={style.status}><strong>{status}</strong></div> */}
        <section className={style.Medium}>
          <SquareTurn  value="×" isSelected = {xIsNext === true}namePlayer="Norbit" typePlayer="Player 1" icono="🤴"/>
            <div className={style.BackgroundBoard}>
        <div className={style.boardRow}>
          <Square value={squares[0]} onSquareClick={()=>{hardleClick(0) }} />
          <Square value={squares[1]} onSquareClick={()=>{hardleClick(1) }}/>
          <Square value={squares[2]} onSquareClick={()=>{hardleClick(2) }}/>
        </div>
        <div className={style.boardRow}>
          <Square value={squares[3]} onSquareClick={()=>{hardleClick(3) }}/>
          <Square value={squares[4]} onSquareClick={()=>{hardleClick(4) }}/>
          <Square value={squares[5]} onSquareClick={()=>{hardleClick(5) }}/>
        </div>
        <div className={style.boardRow}>
          <Square value={squares[6]} onSquareClick={()=>{hardleClick(6) }}/>
          <Square value={squares[7]} onSquareClick={()=>{hardleClick(7) }}/>
          <Square value={squares[8]} onSquareClick={()=>{hardleClick(8) }}/>
        </div>
          </div>
          <SquareTurn  value="o" isSelected = {xIsNext === false}namePlayer="Aurora" typePlayer="Player 2" icono="👸"/>
        </section>
        
        <div className={style.Options}>
          <a className={style.Reset} href="/"><strong>Exit</strong></a>
          <a className={style.Reset} onClick={toggleMute}><strong>{isMuted ? 'Unmute' : 'Mute'}</strong></a>
          <a className={style.Reset} onClick={hardleReset}><strong>Reset</strong></a>
        </div>
      </div>

      <div className={style.Capa}></div>
      <video src={rutaVideo} autoPlay muted loop  type='video/mp4'className='BackgroundVideo'/>
      <ReactAudioPlayer className={style.Audio} src={wonderlandAudio} autoPlay controls loop volume={isMuted ? 0 : 0.5}/>
  </main>
  );
}


function App() {
  
    return (     
       <Board ></Board>
    );
  }

  export default App