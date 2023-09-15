import style from'./styles/Landing.module.css'
import rutaTitle from './assets/Title.png'
import rutaVideo from '../src/assets/Background.mp4';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from './logic/socket';



function Landing() {  
  const navigate = useNavigate();
  
  const  [nickname, setNinkname] = useState("");

  const handleInputChange = (event) => {
    setNinkname(event.target.value);
  };
 
  function handleMatchClick (nickname){
    socket.emit('searchForMatch',  nickname );
  }

  useEffect(() => {
    socket.on('hola', (datos) => {
        console.log(`${datos.player1} y ${datos.player2}` )
    });

  }, []);

  useEffect(() => {
    socket.on('redirectToMach', () => {
      console.log("redireccion");
      navigate('/game');
    });

    return () => {
      socket.off('redirectToMach');
    };
  }, [navigate]);


    return (
     <div className={style.landing}>
      <section className={style.landing__contenedor}>
        <nav className={style.landing__contenedor__main}>
          <img src={rutaTitle} alt="tic tac toe" className={style.landing__contenedor__main__imgTitle}/>
            <input className={style.landing__contenedor__main__input} type="text" value={nickname} onChange={handleInputChange} placeholder='Input your ninkname  Ex:dev'/>
            <a className={style.landing__contenedor__main__btn} onClick={()=>{handleMatchClick(nickname)}}>Match</a>
          </nav>
      </section>
      <div className={style.landing__backgroundLayer}></div>
      <video src={rutaVideo} autoPlay muted loop  type='video/mp4'className={style.landing__backgroundVideo}/>
     </div>
    );
  }


  export default Landing