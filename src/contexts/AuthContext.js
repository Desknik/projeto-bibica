import React, { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie  } from 'nookies'
import Router from 'next/router'

export const AuthContext = createContext({})

export function AuthProvider({children}){
   
    const [user, setUser] = useState(null); //Constante que irá conter os dados do usuário, se não houver nenhum, ele tera o valor nulo.
    const isAuthenticated = !!user; //Constante que irá indicar se o usuário estiver autenticado ou não. Funciona vendo se existe algo na constante user.

    const [carrinhoDeCompras, setCarrinhoDeCompras] = useState([])

    useEffect(() => {
        const cookies = parseCookies();
        const carrinhoCookie = cookies.carrinho;

        if (carrinhoCookie) {
            setCarrinhoDeCompras(JSON.parse(carrinhoCookie));
        }
    }, []);

useEffect(() => {  //Função que irá verificar se tem um token (ou seja, se o usuário estiver logado), se tiver, ele irá buscar os dados atualizados do usuário através do token
   
    const cookies = parseCookies() //Constante que irá conter a função que verifica se existe um cookie 
   
    const token = cookies['Authentication.Token'] //Constante que irá conter, se caso houver um, o cookie do token

    if (token){  //Se houver um token, ele irá enviar o token para uma API que retornará os dados atualizados, e amarzenará o dados na constante user

        const UpdateUsers = async (token) => {
            try{
                const response = await fetch('/api/users/authByToken',{
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify( { token } ),
                });
                
                if(response.ok){
                    const { id, nickname, email, userClass, CompletedDetails, dados } = await response.json();
                    
                    const userData = { id, nickname, email, userClass, CompletedDetails, dados }
                    setUser(userData);
                }else{
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.message);
                }
                
            }catch(error){
                throw new Error(error.message);
            }
        }

        UpdateUsers(token)
    }else{
        setUser(null);
    }

},[])

    const userRegister = async (data) => {

        const { nickname, email, password, confirmPassword, userClass} = data //Desestrutura as informações recebidas do parâmetro
        var userClassId = 2 //Variável que irá conter a informação do tipo do usuário
        
        if(userClass){ //Se userClass for true, o tipo de usuário vai ser 
            userClassId = 1
        }else{
            userClassId = 2
        }

        if(password !== confirmPassword){
            throw new Error('Senhas diferentes');
        }

        try{
            const response = await fetch('/api/users',{
                method: 'POST', 
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({nickname, email, password, userClassId}),
            });
        
            if(response.status == 409){

                throw new Error('Usuário já existente');

            }else if(response.ok){
                signIn({email, password})

            }else{
                const errorResponse = await response.json();
                throw new Error(errorResponse.message);

            }

        }catch (error) {
            throw new Error( error.message );
        }
    }


    const signIn = async (data) => {

        const { nickname, email, password} = data

        try{ //Irá verificar se os dados informados batem com um usuário existente no banco, e irá retornar um token para o cliente
            const response = await fetch('/api/users/auth',{
                method: 'POST', 
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ nickname, email, password }),
            });
            
            if(response.ok){ // Se os dados baterem, ele pega o token, coloca em um cookie para ficar salvo, além de mandar os dados importantes do usuário para constante user
                const { token, id, userClass } = await response.json();

                setCookie(undefined, 'Authentication.Token', token, {
                    maxAge: 60 * 60 * 24 // 24 hours
                });
              
               const AuthUser = { id, userClass };
               setUser(AuthUser)
    
               Router.push("/")

            }else{
                const errorResponse = await response.json();
                throw new Error(errorResponse.message);
            }
        }catch (error) {
            throw new Error( error.message );
        }
    }

    const signOut = () => {
        destroyCookie(null, 'Authentication.Token', {
            path: '/',
        });
        Router.push("/login")
    }

    

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, userRegister, signIn, signOut, carrinhoDeCompras, setCarrinhoDeCompras }}>
            {children}
        </AuthContext.Provider>
    )
}