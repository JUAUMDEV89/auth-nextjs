import { useAuth } from '../hooks/useAuth';
import Router from 'next/router';

export default function Dashboard(){

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