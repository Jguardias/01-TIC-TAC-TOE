import style from '../styles/Game.module.css'



export function Square ({value, onSquareClick}){
   
    return <button  className={`${style.game__container__body__board__square}`} onClick={onSquareClick} >{value}</button>
}
