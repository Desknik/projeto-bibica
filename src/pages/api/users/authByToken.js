import jwt from 'jsonwebtoken';
import { getUsuarioById } from '../../../controllers/getUser';

//Função que irá pegar dados atualizados do usuário pelo um token  
export default async function handleAuth(req, res) {
  
    if (req.method !== "POST") { //Previne metodos posts
        return res.status(405).json({ message: "Metodo não permitido" });
    }

    const { token } = req.body; //irá pegar o token da requisição

    const decoded = jwt.verify(token, process.env.JWT_SECRET); //Irá pegar o dados encriptados pelo token (tipo uma filtragem)
    const id = decoded.id; // Pega o ID atrávés do token

    const user = await getUsuarioById(id); //Usa a função "getUsuarioById" passando o id como parâmetro, a função ira retornar os dados atualizados do usuário 

    const CompletedDetails = !!user && user.dados.telefone && user.dados.nome ? true : false; //Função que vai verificar se os detalhes do usuário está preenchido ou não.


    if (!user) { //Se não retornar nada, a API irá retornar avisando que o usuário não foi encontrado
        return res.status(401).json({ message: 'Id inválido' });
    }
    return res.status(200).json({ id: user.id, nickname:user.nickname, email: user.email, userClass: user.classeUsuarioId, CompletedDetails, dados:user.dados }); //Por fim, a API irá retornar os dados atualizados do usuário 
}

