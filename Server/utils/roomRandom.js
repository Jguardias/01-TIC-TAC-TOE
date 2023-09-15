
export function getRandomRoom(l){
    const character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
  
    for (let i = 0; i < l; i++) {
      const indexRandom = Math.floor(Math.random() * character.length);
      code += character.charAt(indexRandom);
    }
  
    return code;
}