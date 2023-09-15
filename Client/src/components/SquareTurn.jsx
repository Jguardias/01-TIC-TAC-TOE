import style from '../styles/Game.module.css'
import rutaImg from '../assets/Profile.png'

export function SquareTurn ({value, isSelected,namePlayer}){
    return (        
        <div className={`${style.game__container__body__squareTurn} ${isSelected ? style['game__container__body__squareTurn--isSelected'] :""}`}>
            <strong className={`${style.game__container__body__squareTurn__title} ${isSelected ? style["game__container__body__squareTurn__title--isSelected"] :""}` }>🎈Your Turn</strong>
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
