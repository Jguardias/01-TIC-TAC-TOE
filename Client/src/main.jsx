import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { BrowserRouter} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import  Landing from './Landing'
import Game from './Game'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
              <Route path='/' element={<Landing />}/>
              <Route path='/game' element={<Game/>}/>
              
        </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
