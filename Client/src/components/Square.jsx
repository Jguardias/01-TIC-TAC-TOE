import style from '../styles/Game.module.css'



export function Square ({value, onSquareClick, isSelected}){
   
    return <button  className={`${style.Square} ${isSelected ? style.isSelected :""}`} onClick={onSquareClick} >{value}</button>
}
