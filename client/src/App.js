import React , {useEffect,useState} from 'react'


export const App = () => {
  const [backendData, setBackendData] = useState([{}])
  useEffect(() => {
    fetch('/api')
 .then(res => res.json())
 .then(data => setBackendData(data))
  }, [])
  return (
   <h1>hello</h1>
  )
}
export default App