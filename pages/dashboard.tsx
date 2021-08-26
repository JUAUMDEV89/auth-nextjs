import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Router from 'next/router';
import { api } from '../services/api';

export default function Dashboard(){

  useEffect(()=>{
    api.get('/me').then((response)=>{
       console.log(response.data);
    })
  }, []);

    const { user } = useAuth();

    function handleRedirectSignIn(){
       Router.push('/');
    }
     
    return(
        <>
          <h1>Dashboard</h1>
          <h2>Email: { user ? user.email : 'usuario não logado!'}</h2>
          { !user && <button onClick={handleRedirectSignIn}>Fazer login</button>  }
        </>
    )
}