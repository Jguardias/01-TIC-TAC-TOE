import style from '../styles/Game.module.css'
import rutaImg from '../assets/Profile.png'

export function SquareTurn ({value, onSquareClick, isSelected,namePlayer}){
   
    return (        
        <div className={`${style.SquareTurn} ${isSelected ? style.isSelected :""}`} onClick={onSquareClick}>
            <strong className={`${style.SquareTurnTitle} ${isSelected ? style.isSelected :""}` }>👑</strong>
            <div className={style.SquareTurnCircle}>
                <img src={rutaImg} className={style.SquareTurnInCircle} alt="Profile"/>
            </div>
            <strong className={style.SquareTurnbody}>{namePlayer}</strong>
            <div className={style.SquareTurnFoter}>
                    <strong><p>{value}</p></strong>
            </div>
        </div>
    );
}
