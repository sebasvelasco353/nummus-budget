import { useState, useEffect } from 'react'

import axios from 'axios'
import { Button } from './components/ui/button'

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
    <div className='flex flex-col justify-center items-center min-w-dvw min-h-dvh'>
        <p className=''>{data ? JSON.stringify(data) : "No data loaded yet."}</p>
        <Button onClick={() => alert('Button clicked!')}>Click Me</Button>
    </div>
  )
}

export default App
