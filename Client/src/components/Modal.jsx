import style from '../styles/Game.module.css'

export function ModalOptionsGame({isSelected, resetFunction,textBody}){
    return (
        <div className={`${style.modal} ${isSelected ? style['modal--isSelected'] :""}`}>
            <div className={`${style.modal__header}`}>
                <h2> {textBody === "Winner"? "🥇" :"✌"}</h2>
            </div>
            <div className={`${style.modal__body}`}>
            <h2>{textBody}</h2>
            </div>
            <div className={`${style.modal__footer}`}>
             <div className={style.modal__footer__options}>
                <a className={style.modal__footer__options__reset} href="/"><strong>Exit</strong></a>
                <a className={style.modal__footer__options__reset} onClick={resetFunction}><strong>Reset</strong></a>
             </div>
            </div>
        </div>
    );
}
