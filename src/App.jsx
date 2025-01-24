import { useState } from 'react'
import Login from './components/login'
import SingIn from './components/SingIn'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Login/>
      <SingIn/>
    </>
  )
}

export default App
