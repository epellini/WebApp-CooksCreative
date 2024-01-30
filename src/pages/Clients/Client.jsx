import React from 'react'
import {useParams} from 'react-router-dom'

const Client = () => {
  const {id} = useParams()
  return (
    <div>Client {id} </div>
  )
}

export default Client