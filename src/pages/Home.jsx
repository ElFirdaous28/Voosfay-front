import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [])
  return (
    <div>home</div>
  )
}
