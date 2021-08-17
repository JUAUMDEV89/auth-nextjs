import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

import Router from 'next/router';

let cookies = parseCookies();

export const api = axios.create({
   baseURL: 'http://localhost:3333',
   headers:{
      Authorization: `bearer ${cookies['nextAuth.token']}`
   }
});

api.interceptors.response.use(response=>{
   return response;
}, (error: AxiosError) => {
     if(error.response.status === 401){
       if(error.response.data?.code === 'token.expired'){
          
           cookies = parseCookies();

           const { 'nextauth.refreshToken': refreshToken } = cookies;

           api.post('/refresh', {
              refreshToken
           }).then(response=>{
              const { token } = response.data;

              setCookie(undefined, 'nextAuth.token', token, {
               maxAge: 60 * 60 * 24 * 30, //1 mouth
               path: '/'
             });
   
             setCookie(undefined, 'nextAuth.refreshToken', refreshToken, {
               maxAge: 60 * 60 * 24 * 30, //1 mouth
               path: '/'
             });
           })

       }else{
          Router.push('/');
       }
     }
})