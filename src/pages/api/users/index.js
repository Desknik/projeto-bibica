import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt';

import { getUsuarioByEmail } from '../../../controllers/getUser'

const prisma = new PrismaClient();

export default async function handler(req, res){
  const { method } = req

  if (method === "GET"){
    const users = await prisma.usuario.findMany();
    
      prisma.$disconnect()
      return res.status(200).json({
        data: users,
      })
  }
  else if ( method === "POST"){//Previne metodos posts

    const { nickname, email, password, userClassId } = req.body; //Pega as informações enviadas à API
    
    const user = await getUsuarioByEmail(email); //Coloca os dados do usuário que contém o mesmo email enviado a API na costante user
    


    if(user){ //Caso houver um usuário cadastrado com o email, ele irá retornar um erro, dizendo que já existe um usuário cadastrado
        return res.status(409).json({ message: "Usuário já existente" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //Criptografa a senha enviada à API

    const createUser = await prisma.usuario.create({
      data: {
        classeUsuario: {
          connect: { id: userClassId }
        },
        nickname: nickname,
        email: email,
        senha: hashedPassword,
        dados: {
          create: {}
        }
      }
    })

    prisma.$disconnect()
    return res.status(201).json({
      data: createUser
    })
  }
}