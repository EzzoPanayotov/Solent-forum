import React, {useRef, useState} from 'react'
import { useAuth } from '../Contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

import '../App.css'

function RegisterComponent() {

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const {signup} = useAuth();
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault()

    if(passwordRef.current.value !== passwordConfirmRef.current.value){
      return setError('Passwords do not match!')
    }

    try {
      setError('')
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      navigate('/')

    } catch {
      setError('Failed to create an account')
    }

    setLoading(false)
  }

  return (
    <div className='registerComponent'>
      <div className='registerFormContainer'>
        <h2>Join Solent's Curious Community</h2>
        <p>Get answers to your questions here!</p>
        {error && <p className='RegisterError'>{error}</p>}
        {/* form here */}
        <form className='registerForm' onSubmit={handleSubmit}>
          <label>Email</label>
            <input type='email' ref={emailRef} required/>
          <label>Password</label>
            <input type='password' ref={passwordRef} required/>
          <label>Confirm Password</label>
            <input type='password' ref={passwordConfirmRef} required/>
          <button disabled={loading} className='formButton' type='submit'>Register</button>
        </form> 
        Already got an account? <Link to = '/Login'>Login</Link>
      </div>
      <div className='registerComponentImage'>
        <img src={process.env.PUBLIC_URL + '/Images/SolentUniversity.jpg'}
          alt='Solent University Southampton Pod'/>
      </div>
    </div>
  )
}

export default RegisterComponent