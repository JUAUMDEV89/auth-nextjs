import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';
import Route from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

interface authProps{
    children: ReactNode
}

interface User{
  email: string
  permissions: string[]
  roles: string[]
}

interface authContextProps{
  signIn: (data: {})=>Promise<void>
  isAuthenticated: boolean
  user: User
}

interface signInProps{
  email: string,
  password: string
}

export const AuthContext = createContext({} as authContextProps);

export function AuthProvider({ children }: authProps){

   const [user, setUser] = useState<User>(null);

   const isAuthenticated = !!user;

   useEffect(()=>{
    const {'nextAuth.token': token} = parseCookies();

    if(token){
     api.get('/me').then(response =>{
       const { email, permissions, roles } = response.data;

       setUser({ email, permissions, roles });
     }).catch(err=>{
       destroyCookie(undefined, 'nextAuth.token');
       destroyCookie(undefined, 'nextAuth.refreshToken');

       Route.push('/');
     })
    }
  }, []);


   async function signIn({email, password}: signInProps){
      try{
        const response = await api.post('sessions', {
          email,
          password
        });

        const { permissions, roles, token, refreshToken } = response.data;

        setUser({
          email,
          permissions,
          roles
        });

          setCookie(undefined, 'nextAuth.token', token, {
            maxAge: 60 * 60 * 24 * 30, //1 mouth
            path: '/'
          });

          setCookie(undefined, 'nextAuth.refreshToken', refreshToken, {
            maxAge: 60 * 60 * 24 * 30, //1 mouth
            path: '/'
          });

        Route.push('/dashboard');

        console.log(user);
      }catch(err){
        console.log(err);
      }
   }

    return(
      <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
        { children } 
      </AuthContext.Provider>
    )
}
