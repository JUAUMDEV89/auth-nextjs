import { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useAuth();

  function handleSignIn(e: FormEvent){
      e.preventDefault();

      signIn({ email, password });

  }

  return (
   <>
     <form onSubmit={handleSignIn}>
       <label htmlFor="">
         Email
         <input type="text" name="" id="" value={email} onChange={(e)=>setEmail(e.target.value)}/>
       </label>

       <label htmlFor="">
         Password
         <input type="password" name="" id="" value={password} onChange={(e)=>setPassword(e.target.value)} />
       </label>

       <button type="submit">Login</button>
     </form>
   </>
  )
}
