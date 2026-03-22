
import { useState } from "react";
const Card = ({name, type, attack, hp, id}) => {
    const [popup, setPopup] = useState(false)

    const type_colors = {
    "Grass" : "#9ee493",
    "Fire" : "#FFB703",
    "Water": "#00b4d8",
    "Psychic": "#a53860",
    "Electric" : "#ffd500",
    "Normal" : "#A8A77A",
    "Ghost" : "#c0d6df",
    "Dragon" : "#dc2f02",
    "Fighting": "#c22e28",
    "Rock" : "#3c464b"
  }
    const shiningColors = {
  "Grass": "#bff0b7",
  "Fire": "#ffd166",
  "Water": "#4fd1e8",
  "Psychic": "#c76a8e",
  "Electric": "#ffe44d",
  "Normal": "#c3c2a0",
  "Ghost": "#d9e7ee",
  "Dragon": "#ff6b3a",
  "Fighting": "#e45b55",
  "Rock": "#66757c"
}
    return (
        <div className={`card ${popup ? "card:hover" : ""}`}style={{borderColor:type_colors[type], backgroundColor: popup ? shiningColors[type] : "white"}}
        onMouseEnter={()=> setPopup(true)}
        onMouseLeave={()=> setPopup(false)}
        >
       <p style={{ fontFamily: "Be Vietnam Pro", textTransform:"uppercase", fontWeight: "bolder" , marginBottom: 4, fontSize:25, color: popup && (type === "Dragon" || type === "Fighting") ? "white" : "#e60013"}}>{name}</p>

       <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}></img>

       <p className={"type-background"} style={{backgroundColor:type_colors[type]}}>{type}</p>

       <p style={{ fontFamily: "PT Sans", fontWeight: "normal", marginBottom: 4 }}>⚔️ Attack: {attack}</p>
       
       <p style={{ fontFamily: "PT Sans", fontWeight: "normal", marginBottom: 4 }}>❤️ Health: {hp}</p>
       
       </div>
    );
};
export default Card;