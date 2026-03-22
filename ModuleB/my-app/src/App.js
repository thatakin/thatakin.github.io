import Circle from "./Circle";
import Squareplot from "./Squareplot"
import { useState } from "react";
import { pokemons } from "Pokemons"

const App = () => {
    const [color, setColor] = useState("dodgerblue");
    const [size, setSize] = useState(50);
    const [showCircle, setShowCircle] = useState(true);
    return (
        <div> 
            <div style={{ display: "flex", gap: 24 }}>
                <Squareplot color="#2263eb" data={[220, 180, 140, 90, 50]} title={"TITLE"} />
                {showCircle && <Circle color={color} size={size} />}
                {showCircle && <Circle color={color} size={size} />}
                {showCircle && <Circle color={color} size={size} />}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => setColor(color === "dodgerblue" ? "tomato" : "dodgerblue")}>ChangeColor</button>
                <button onClick={() => setSize(size + 20)}>Bigger</button>
                <button onClick={() => setSize(size - 20)}>Smaller</button>
                <button onClick={() => setShowCircle(!showCircle)}>Show/Hide</button>
            </div>
        </div>
    );
};



export default App;