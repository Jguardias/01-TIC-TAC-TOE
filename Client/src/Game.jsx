import { useState, useEffect } from 'react';
import { Square } from './components/Square';
import { SquareTurn} from './components/SquareTurn'
import { ModalOptionsGame } from './components/Modal';
import { calculateWinner } from './logic/constants';
import style from './styles/Game.module.css'
import ReactAudioPlayer from 'react-audio-player';
import wonderlandAudio from './assets/Wonderland.ogg';
import clickSound from  './assets/sound.mp3';
import winnerSound from  './assets/SondWinner.mp3';
import confetti from 'canvas-confetti';
import rutaVideo from '../src/assets/Background.mp4';
import socket from './logic/socket';





const PLAYERS ={
  X: <img src="../src/assets/x.png" alt="Player X" className={style.game__container__body__board__square__playerIcon} />,
  O: <img src="../src/assets/o.png" alt="Player O" className={style.game__container__body__board__square__playerIcon}/>
}

const  STATUS = {
  WIN: "Winner",
  LOSE: "losser",
  DRAW: "It's a Draw",
}

function Board(){

  const [xIsNext,setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [statusModal, setStatusModal] = useState("")
  const [isMuted, setIsMuted] = useState(false);
  const [showModal, setShowModal]= useState(false);
  const [winnerSoundPlayed, setWinnerSoundPlayed] = useState(false); 

  const [filledBarrTime,setFilledBarrTime] = useState(100)
  const [colorBarrTime, setColorBarrTime] = useState('green')
  const [hasExecutedIsUpTime, setHasExecutedIsUpTime] = useState(false)
  const [thereAreWinner,setThereAreWinner] = useState(true)

  const STYLESTIMEBARCHILD = {
    height: '100%',
    width: `${filledBarrTime}%`,
    backgroundColor:colorBarrTime,
    borderRadius:40,
    textAlign: 'right'
  }
  useEffect(() => {
    socket.on('gameStart', () => {
      console.log('El juego ha comenzado. Tu oponente es:');
    });

    return () => {
      socket.off('gameStart');
    };
  }, []);

  useEffect(() => {
    socket.on('event', (data) => {
      console.log(`Movimiento del oponente: Casilla ${data.position} - Jugador ${data.player}`);
      const nextSquares = squares.slice();
      nextSquares[data.position] = data.player ?  PLAYERS.X : PLAYERS.O;
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
      setFilledBarrTime(data.barra)
      console.log(data);
      console.log("LEEEEE")
    });

    return () => {
      socket.off('event');
    };

  }, [squares, xIsNext]);


  useEffect(() => {
    const interval = setInterval(() => {
      setFilledBarrTime(prevProgress => {
        const newProgress = Math.max(prevProgress - 10, 0);
        if (thereAreWinner && newProgress > 70) {
          setColorBarrTime('green');
        } else if (thereAreWinner && newProgress > 30) {
        setColorBarrTime('orange');
        } else if(thereAreWinner && newProgress > 10) {
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
  }, [thereAreWinner]);


  useEffect(() => {
    if (hasExecutedIsUpTime) {
        if(thereAreWinner){
          setXIsNext(!xIsNext);
        }
      setHasExecutedIsUpTime(false);
    }
  },[hasExecutedIsUpTime,xIsNext,thereAreWinner]);


  function hardleReset(){
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinnerSoundPlayed(false); 
    setShowModal(false)
    setThereAreWinner(true);
    timeBarrReset();
  }


  function timeBarrReset(){
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

  const GETVALUEWINNER = calculateWinner(squares);
  
  function checkForDraw() {
    return GETVALUEWINNER === null && !squares.includes(null);
  }


  function hardleClick(i){

    if(squares[i] || GETVALUEWINNER === "Winner"){  
      return; 
    }

    const nextSquares = squares.slice();
    xIsNext ? nextSquares[i] = PLAYERS.X : nextSquares[i] = PLAYERS.O;

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    playSound(clickSound);
    socket.emit('event',  { position: i, player: xIsNext, barra: 100 });
    timeBarrReset();
   
  }

  useEffect(() => {
    if (GETVALUEWINNER === "Winner") {
      callModalWinner(GETVALUEWINNER);
    } else if (checkForDraw()) {
      callModalWinner(null);
    }
  }, [GETVALUEWINNER, checkForDraw()]);

  function callModalWinner(condition){
   
    if (condition === "Winner" ) {
      if (!winnerSoundPlayed) {
        confetti()
        playSound(winnerSound);
        setWinnerSoundPlayed(true);
        setShowModal(true);
        setThereAreWinner(false);
        setStatusModal(STATUS.WIN);
      }
    } else {
      setShowModal(true);
      setThereAreWinner(false);
      setStatusModal(STATUS.DRAW);
    }
  
  }


  return (
    <main className={style.game}> 
      <div className={style.game__container}>

      <header className={style.game__container__header}>
       <div className={style.game__container__header__timeBar}>
           <div style={STYLESTIMEBARCHILD}>
             <span className={style.game__container__header__timeBar__text}>{`time`}</span>
           </div>
        </div>
      </header>

        <section className={style.game__container__body}>
          <SquareTurn  value="×" isSelected = {xIsNext === true} namePlayer="Norbit"/>
      <div className={style.game__container__body__board}>
        <div>
          <Square value={squares[0]} onSquareClick={()=>{hardleClick(0) }} />
          <Square value={squares[1]} onSquareClick={()=>{hardleClick(1) }}/>
          <Square value={squares[2]} onSquareClick={()=>{hardleClick(2) }}/>
        </div>
        <div>
          <Square value={squares[3]} onSquareClick={()=>{hardleClick(3) }}/>
          <Square value={squares[4]} onSquareClick={()=>{hardleClick(4) }}/>
          <Square value={squares[5]} onSquareClick={()=>{hardleClick(5) }}/>
        </div>
        <div>
          <Square value={squares[6]} onSquareClick={()=>{hardleClick(6) }}/>
          <Square value={squares[7]} onSquareClick={()=>{hardleClick(7) }}/>
          <Square value={squares[8]} onSquareClick={()=>{hardleClick(8) }}/>
        </div>
      </div>
          <SquareTurn  value="o" isSelected = {xIsNext === false} namePlayer="Aurora" />
        </section>
        
        <ModalOptionsGame textBody={statusModal} isSelected = {showModal === false} resetFunction={()=>{hardleReset()}}/>
      </div>

      <div className={style.game__backgroundLayer}></div>
      <video src={rutaVideo} autoPlay muted loop  type='video/mp4'className={style.game__backgroundVideo}/>
      <ReactAudioPlayer className={style.game__audio} src={wonderlandAudio} autoPlay controls loop volume={isMuted ? 0 : 0.5}/>
  </main>
  );
}


function App() {
    return (     
       <Board ></Board>
    );
  }
 
  export default App