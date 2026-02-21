import { useState, useEffect } from 'react'
import './App.css'

import axios from 'axios'

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:3000/health')
      .then(function (response) {
        console.log(response)
        setData(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])

  return (
    <>
        <p>{data ? JSON.stringify(data) : "No data loaded yet."}</p>
    </>
  )
}

export default App
