import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUsuarioByEmail, getUsuariosByNickname } from '../../../controllers/getUser';

//Função que irá verificar se o usuário está logado 
export default async function handleAuth(req, res) {
  
    if (req.method == "POST") { 
 
        const { nickname, email, password } = req.body; //Pega os dados enviados à API

        if(email){
            
            const user = await getUsuarioByEmail(email); //Coloca os dados do usuário que contém o mesmo email enviado a API na costante user
    
            if (!user) { //Caso não houver um usuário cadastrado com o email, ele irá retornar um erro, dizendo que o email é invalido
              return res.status(401).json({ message: 'Email inválido' });
            }

            const match = await bcrypt.compare(password, user.senha); //Compara a senha enviada à API a senha criptografada do banco
    
            if (!match) { //Se a senha não for igual, ele irá retornar um erro, dizendo que a senha é inválida
            return res.status(401).json({ message: 'Senha inválida' });
            }
            
        
            const token = jwt.sign({ id: user.id, userClass: user.classeUsuarioId }, process.env.JWT_SECRET); // Gera um token contendo os dados do usuário
        
            return res.status(200).json({ token, id: user.id, userClass: user.classeUsuarioId }); //Retorna o token criado
        }
        else if(nickname){

            function formatText(text) {
                return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
            }

            const formatedNickname = formatText(nickname)
              

            const user = await getUsuariosByNickname({formatedNickname, password})

            if (!user) { //Caso não houver um usuário cadastrado com o email, ele irá retornar um erro, dizendo que o email é invalido
                return res.status(401).json({ message: 'Usuário ou Senha Inválida' });
            }

            const token = jwt.sign({ id: user.id, userClass: user.classeUsuarioId }, process.env.JWT_SECRET); // Gera um token contendo os dados do usuário
            return res.status(200).json({ token, id: user.id, userClass: user.classeUsuarioId }); //Retorna o token criado

        }
    }

}
