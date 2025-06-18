import { useState } from 'react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SignedOut>
        <SignUpButton />
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <h2>Welcome! 🎉</h2>
      </SignedIn>
    </>
  )
}

export default App
