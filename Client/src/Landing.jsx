import style from'./styles/Landing.module.css'
import rutaTitle from './assets/Title.png'
import rutaVideo from '../src/assets/Background.mp4';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactAudioPlayer from 'react-audio-player';
import musicLoop from './assets/gameMusicLoopLanding.ogg';
import socket from './logic/socket';



function Landing() {  
  
  const navigate = useNavigate();
  
  const  [nickname, setNinkname] = useState("");
  const  [error, setError] = useState("");
  const  [isSelected, setIsSelected] = useState(false);
  const  [btnTextMatch,setBtnTextMatch] = useState(true);
  

  useEffect(() => {
    socket.on('matchFound', () => {
      navigate('/game');
    });
    return () => {
      socket.off('matchFound');
    };
  }, [navigate]);

  
  function handleInputChange (event) {
      setNinkname(event.target.value);
      if (event.target.value === "" ) {
        setIsSelected(false)
        setError('Please enter a nickname.');
      } else if (event.target.value.length >= 6) {
        setIsSelected(false)
        setError('The nickname cannot be more than 6 characters.');     
      }else{
        setIsSelected(true)
        setError('Wonderful choice!');
      }
  }

  function handleMatchClick (nickname){
      if(nickname.length > 0 && nickname.length < 7){
        setBtnTextMatch(false);
        setIsSelected(true)
        setError('Searching for players');
        socket.emit('searchForMatch',  nickname );
      }
  }

  function handleFormSubmit (event){
    event.preventDefault();
  }

    return (
     <div className={style.landing}>
      <section className={style.landing__contenedor}>
        <nav className={style.landing__contenedor__main}>
          <img src={rutaTitle} alt="tic tac toe" className={style.landing__contenedor__main__imgTitle}/>
            <form onSubmit={handleFormSubmit} className={style.landing__contenedor__main__form}>
              <input className={style.landing__contenedor__main__form__input} type="text" value={nickname} onChange={handleInputChange} placeholder='Input your ninkname  Ex:dev' maxLength={6} minLength={1} readOnly={!btnTextMatch}/>
              <p className={`${style.landing__contenedor__main__form__text} ${isSelected ? style["landing__contenedor__main__form__text--isSelected"]: ""} `}>{error}</p>
              <button  className={style.landing__contenedor__main__form__btn} onClick={()=>{handleMatchClick(nickname)}} disabled={!btnTextMatch} >{btnTextMatch ? "Match": <span className={style.loader}></span>}</button>
            </form>
          </nav>
      </section>
      <div className={style.landing__backgroundLayer}></div>
      <ReactAudioPlayer className={style.game__audio} src={musicLoop} autoPlay controls loop volume={0.5}/>
      <video src={rutaVideo} autoPlay muted loop  type='video/mp4'className={style.landing__backgroundVideo}/>
     </div>
    );
  }

  export default Landing