import { useState } from "react"
import "./App.css"

function Saludo() { return <h1>Hola Mundo!</h1> }

function App() {
  // useState es la "memoria" del componente
  // ciudad guarda lo que el usuario escribe
  // tiempo guarda los datos que nos devuelve la API
  // error guarda si algo sale mal
  const [ciudad, setCiudad] = useState("")
  const [tiempo, setTiempo] = useState(null)
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  // API KEY
  const API_KEY = import.meta.env.VITE_API_KEY

  // esta funcion se ejecuta cuando el usuario busca
  const buscarTiempo = async () => {
    if (!ciudad) return // si no escribio nada no hace nada

    setCargando(true)
    setError(null)
    setTiempo(null)

    try {
      // llamada a la API con fetch, igual que en JS normal
      const respuesta = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
      )

      // si la ciudad no existe la API devuelve error
      if (!respuesta.ok) {
        setError("Ciudad no encontrada, prueba con otra.")
        return
      }

      const datos = await respuesta.json()
      setTiempo(datos) // guardamos los datos en el estado

    } catch {
      setError("Hubo un problema con la conexion.")
    } finally {
      setCargando(false)
    }
  }

  // detecta si el usuario pulsa Enter en el input
  const alPulsarTecla = (e) => {
    if (e.key === "Enter") buscarTiempo()
  }

  return (
    <div className="app">
      <h1>App del Tiempo</h1>

      <div className="buscador">
        <input
          type="text"
          placeholder="Escribe una ciudad..."
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          onKeyDown={alPulsarTecla}
        />
        <button onClick={buscarTiempo}>Buscar</button>
      </div>

      {/* esto es JSX: podemos meter condiciones con && */}
      {cargando && <p className="mensaje">Buscando...</p>}
      {error && <p className="mensaje error">{error}</p>}

      {/* si hay datos los mostramos */}
      {tiempo && (
        <div className="tarjeta">
          <h2>{tiempo.name}, {tiempo.sys.country}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${tiempo.weather[0].icon}@2x.png`}
            alt={tiempo.weather[0].description}
          />
          <p className="temperatura">{Math.round(tiempo.main.temp)}°C</p>
          <p className="descripcion">{tiempo.weather[0].description}</p>
          <div className="detalles">
            <span>Humedad: {tiempo.main.humidity}%</span>
            <span>Viento: {tiempo.wind.speed} m/s</span>
            <span>Sensación: {Math.round(tiempo.main.feels_like)}°C</span>
          </div>
        </div>
      )}
    </div>
  )


}

export default App