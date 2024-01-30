import React from 'react'
import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
// We can use this hook to navigate to a different page after completing an action/form submission.
const NotFound = () => {
  const navigate = useNavigate()
    useEffect(() => {
        setTimeout(() => {
            navigate('/') // if we use (-1) it will go back to the previous page (useful for new client)
        }, 2000)
    }, [])
    return (
    <div>NotFound</div>
  )
}

export default NotFound