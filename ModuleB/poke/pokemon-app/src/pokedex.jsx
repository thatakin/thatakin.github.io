import { useState, useMemo } from 'react'
import './App.css'
import './index.css'
import pokemons from './Pokemons.jsx'
import Card from './Card.jsx'

function App({children}) {
  const uniqueTypes = [...new Set(pokemons.map((pokemon) => pokemon.type))].sort();
  const [searchQuery, setSearchQuery] = useState(''); //Search results
  const [selectedType, setSelectedType] = useState(null) //Filter results
  const matchedPokemon = useMemo(() => {
  let result = pokemons;
  if (selectedType) {
  result = result.filter((pokemon) => selectedType === pokemon.type);
}
  if (searchQuery.trim()) {
  result = result.filter((pokemon) => 
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  }
  return result;
}, [searchQuery, selectedType])
  return (
    <div>
      <h1 style={{fontSize: 45, fontFamily:"Pokemon Solid", color: "#ffcc01"}}>Pokemon Collection </h1>
      <h2 style={{fontSize: 35, fontFamily:"PT Sans", fontWeight:700, color: "#3c56a8"}}>Gotta Catch 'em All</h2>
      <div style={{display: 'flex', margin: 10, padding: 20}}>
        <div style={{textAlign: "left"}} > 
          <input
            type="text"
            placeholder="Search for a Pokémon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              marginTop: 12,
              padding: '18px 12px',
              fontSize: 14,
              border: '3px solid #3c56a8',
              borderRadius: 50,
              width: 200,
              marginBottom: 25
            }}
          />
        </div>
        <div style={{ 
              marginTop: 12,
              padding: '18px 12px',
              fontSize: 14,
              marginBottom: 25,
              marginRight:0
            }}> {/* This is the drop-down menu. */}
          <label for="pokemons">Filter by Pokémon Type: </label>
          <select onChange={(e) => setSelectedType(e.target.value)}>
                <option value="">All Types</option>
                        {uniqueTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>))}
          </select>
        </div>
        
      </div>
      <div style={{ display: "grid", gridTemplateRows: "repeat(4, 1fr)", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        {matchedPokemon.map((d) => (
          <Card 
          key={d.id}
          id={d.id}
          name={d.name}
          type={d.type}
          hp={d.hp}
          attack={d.attack}      
          />
        ))}
        </div>
    </div>
  )
  }

export default App
