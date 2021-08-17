import { createContext, ReactNode, useReducer, useState } from 'react';
import { api } from '../services/api';
import Route from 'next/router';
import { setCookie } from 'nookies';

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

          setCookie(undefined, 'auth.token', token, {
            maxAge: 60 * 60 * 24 * 30, //1 mouth
            path: '/'
          });

          setCookie(undefined, 'auth.refreshToken', refreshToken, {
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
