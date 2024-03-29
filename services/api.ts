import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

import Router from 'next/router';

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue = [];

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
           const originalConfig = error.config;

           if(!isRefreshing){

            isRefreshing = true;

            api.post('/refresh', {
               refreshToken
            }).then(response=>{
               const { token } = response.data;
 
               setCookie(undefined, 'nextAuth.token', token, {
                maxAge: 60 * 60 * 24 * 30, //1 mouth
                path: '/'
              });
    
              setCookie(undefined, 'nextAuth.refreshToken', response.data.refreshToken, {
                maxAge: 60 * 60 * 24 * 30, //1 mouth
                path: '/'
              });
 
              api.defaults.headers['Authorization'] = `Bearer ${token}`

              failedRequestQueue.forEach((request)=>{ request.onSuccess(token) })
              failedRequestQueue = [];

            }).catch(err=>{
               failedRequestQueue.forEach((request)=>{ request.onFailure(err) })
               failedRequestQueue = [];
            }).finally(()=>{
               isRefreshing = false;
            })
           }

           return new Promise((resolve, reject)=>{
               failedRequestQueue.push({
                  onSuccess: (token: string)=>{
                     originalConfig.headers['Authorization'] = `Bearer ${token}`

                     resolve(api(originalConfig));
                  }, 
                  onFailure: (err: AxiosError)=>{
                     reject(err);
                  }
               })            
           });

       }else{
         destroyCookie(undefined, 'nextAuth.token');
         destroyCookie(undefined, 'nextAuth.refreshToken');
  
         Router.push('/');
       }
     }

     return Promise.reject(error);
})