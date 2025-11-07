import './App.css'
import { Routes , Route } from "react-router-dom"
import Authentification from './pages/Authentification'
import FitTrack from './pages/Fittrack'


function App() {

  return (
    <>

        <Routes>
          <Route path='/' element={<Authentification/>}/>
          <Route path='/register' element={<Authentification register/>}/>

          <Route path='/dashboard/:id' element={<FitTrack/>}/>
          

        </Routes>
      
    </>
  )
}

export default App
