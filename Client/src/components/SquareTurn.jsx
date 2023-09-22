import style from '../styles/Game.module.css'
import rutaImg from '../assets/Profile.png'

export function SquareTurn ({value, isSelected,namePlayer}){
    return (        
        <div className={`${style.game__container__body__squareTurn} ${isSelected ? style['game__container__body__squareTurn--isSelected'] :""}`}>
            <strong className={`${style.game__container__body__squareTurn__title} ${isSelected ? style["game__container__body__squareTurn__title--isSelected"] :""}` }>
            <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512"         className={style.arrow}><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"fill="white"/></svg>

            </strong>
            <div className={style.game__container__body__squareTurn__circle}>
                <img src={rutaImg} className={style.game__container__body__squareTurn__circle__img} alt="Profile"/>
            </div>
            <strong className={style.game__container__body__squareTurn__namePlayer}>{namePlayer}</strong>
            <div className={style.game__container__body__squareTurn__footer}>
                    <strong><p>{value}</p></strong>
            </div>
        </div>
    );
}
