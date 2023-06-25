import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()


export const getUsuarioByEmail = async (email) => {
    const usuario = await prisma.usuario.findUnique({
      where: { email: email },
    });
  
    prisma.$disconnect()
    return usuario;
};

export const getUsuarioById = async (id) => {
    const usuario = await prisma.usuario.findUnique({
      where: { id: id },
      include:{dados: true}
    });
  
    prisma.$disconnect()
    return usuario;
};

export const getUsuariosByNickname = async ({ nickname, password }) => {
   
    const usuarios = await prisma.usuario.findMany({ where: { nickname: nickname } });  // Busca todos os usuários com o nickname fornecido
  
   
    for (const usuario of usuarios) {  // Verifica a senha para cada usuário retornado

      if (await bcrypt.compare(password, usuario.senha)) {
      
        prisma.$disconnect()
        return usuario;
      }

    }

    prisma.$disconnect()
    return null;
  }