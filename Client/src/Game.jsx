import { useState, useEffect } from 'react';
import { Square } from './components/Square';
import { SquareTurn} from './components/SquareTurn'
import { ModalOptionsGame } from './components/Modal';
import { calculateWinner } from './logic/constants';
import style from './styles/Game.module.css'
import ReactAudioPlayer from 'react-audio-player';
import musicLoop from './assets/gameMusicLoop.ogg';
import clickSound from  './assets/sound.mp3';
import winnerSound from  './assets/SondWinner.mp3';
import confetti from 'canvas-confetti';
import rutaVideo from '../src/assets/Background.mp4';
import socket from './logic/socket';

import xIcon from '../src/assets/x.png';
import oIcon from '../src/assets/o.png';



const PLAYERS ={
  X: <img src={xIcon} alt="Player X" className={style.game__container__body__board__square__playerIcon} />,
  O: <img src={oIcon} alt="Player O" className={style.game__container__body__board__square__playerIcon}/>
};

const  STATUS = {
  WIN: "Winner",
  LOSE: "Losser",
  DRAW: "It's a Draw",
};

const playerIDs = [];

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

  const [infoRoom, setInfoRoom] = useState({
    nameRoom: "",
    nickPlayer1: "",
    nickPlayer2: ""
  });

  const stylesTimeBarChild = {
    height: '100%',
    width: `${filledBarrTime}%`,
    backgroundColor:colorBarrTime,
    borderRadius:40,
    textAlign: 'right'
  }

  useEffect(() => {
    socket.on('sendInfoRoom', ({room,player1,player2}) => {
      setInfoRoom(prevInfoRoom => ({
        ...prevInfoRoom,
        nameRoom: room,
        nickPlayer1: player1,
        nickPlayer2: player2
      }));
      return; 
    });
    return () => {
      socket.off('sendInfoRoom');
    };
  }, [infoRoom]);  
  
  useEffect(() => {
    socket.on('sendPlayerIDs', ({idPlayer1,idPlayer2}) => {
      playerIDs.push(idPlayer1,idPlayer2)
    });
    return () => {
      socket.off('sendPlayerIDs');
    };
  }, [playerIDs]);

  useEffect(() => {
    socket.on('gameMove', (data) => {
      const nextSquares = squares.slice();
      nextSquares[data.position] = data.player ?  PLAYERS.X : PLAYERS.O;
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
      setFilledBarrTime(data.barra)
    });
    return () => {
      socket.off('gameMove');
    };
  }, [squares, xIsNext]);

  useEffect(() => {
    const timeBarUpdateInterval = setInterval(() => {
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
    return () => clearInterval(timeBarUpdateInterval);
  }, [thereAreWinner]);

  useEffect(() => {
    if (hasExecutedIsUpTime) {
        if(thereAreWinner){
          setXIsNext(!xIsNext);
        }
      setHasExecutedIsUpTime(false);
    }
  },[hasExecutedIsUpTime,xIsNext,thereAreWinner]);

  useEffect(() => {
    if(calculateWinner(squares) === STATUS.WIN){
       socket.emit("playerWin", xIsNext)
    }else if (calculateWinner(squares) === STATUS.LOSE){
      callModal("lOSE", STATUS.LOSE)
    }else if (checkForDraw()){
      callModal("",STATUS.DRAW)
    }else{
      return;
    }
  }, [xIsNext]);
  
  useEffect(()=>{
    socket.on('gameResult', (data)=>{
      if(data === "Winner"){
        callModal(data, STATUS.WIN)
      } else{
        callModal(data, STATUS.LOSE)
      }
    });
    return () => {
      socket.off('gameResult');
    };
  },[xIsNext]);

  useEffect(() => {
    socket.on('resetGame', () => {
      hardleReset()
    });
    return () => {
      socket.off('resetGame');
    };
  }, [hardleReset]);

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

  function hardleResetMatch(){
    socket.emit("resetGame")
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
    if(xIsNext === true && socket.id === playerIDs[0] || xIsNext === false && socket.id === playerIDs[1]){
      if(squares[i] || calculateWinner(squares) === "Winner"){  
        return; 
      }
      const nextSquares = squares.slice();
      xIsNext ? nextSquares[i] = PLAYERS.X : nextSquares[i] = PLAYERS.O;
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
      playSound(clickSound);
      socket.emit('gameMove',  { position: i, player: xIsNext, barra: 100 });
      timeBarrReset();
    }else{
      return;
    }
  }

  function checkForDraw() {
    return calculateWinner(squares) === null && !squares.includes(null);
  }
  
  function callModal(condition, status) {
    if (condition === "Winner") {
      if (!winnerSoundPlayed) {
        confetti();
        playSound(winnerSound);
        setWinnerSoundPlayed(true);
        setShowModal(true);
        setThereAreWinner(false);
        setStatusModal(status);
      }
    } else {
      setShowModal(true);
      setThereAreWinner(false);
      setStatusModal(status);
    }
  }
  
  return (
    <main className={style.game}> 
      <div className={style.game__container}>

      <header className={style.game__container__header}>
       <div className={style.game__container__header__timeBar}>
           <div style={stylesTimeBarChild}>
             <span className={style.game__container__header__timeBar__text}>{`time`}</span>
           </div>
        </div>
      </header>

        <section className={style.game__container__body}>
          <SquareTurn  value="×" isSelected = {xIsNext === true} namePlayer={infoRoom.nickPlayer1}/>
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
          <SquareTurn  value="o" isSelected = {xIsNext === false} namePlayer={infoRoom.nickPlayer2} />
        </section>
        
        <ModalOptionsGame textBody={statusModal} isSelected = {showModal === false} resetFunction={()=>{hardleResetMatch()}}/>
      </div>

      <div className={style.game__backgroundLayer}></div>
      <video src={rutaVideo} autoPlay muted loop  type='video/mp4'className={style.game__backgroundVideo}/>
      <ReactAudioPlayer className={style.game__audio} src={musicLoop} autoPlay controls loop volume={isMuted ? 0 : 0.5}/>
  </main>
  );
}


function App() {
    return (     
       <Board ></Board>
    );
  }
 
  export default App