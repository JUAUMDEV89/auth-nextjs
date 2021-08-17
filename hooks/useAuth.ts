import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export function useAuth(){
   const { isAuthenticated, signIn, user } = useContext(AuthContext);

   return {
       isAuthenticated,
       signIn,
       user
   }
}