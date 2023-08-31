import style from'./styles/Landing.module.css'
import rutaTitle from './assets/Title.png'
import rutaVideo from '../src/assets/Background.mp4';
import { useEffect } from 'react';
import io from 'socket.io-client'

 const  socket = io('/');

function Landing() {  
    return (
     <div className={style.Landing}>
      <section className={style.Contenedor}>
        <nav className={style.Menu}>
          <img src={rutaTitle} alt="tic tac toe" className={style.Title}/>
            <input className={style.Input} type="text" placeholder='Input your ninkname  Ex:dev'/>
            <a className={style.Enlace} href="/game">Match</a>
          </nav>
      </section>
      <div className={style.Capa}></div>
      <video src={rutaVideo} autoPlay muted loop  type='video/mp4'className='BackgroundVideo'/>
     </div>
    );
  }


  export default Landing