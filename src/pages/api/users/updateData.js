import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default async function handler(req, res){
  const { method } = req

  if (method === "PUT"){

    const { id, nickname, email, nome, telefone, cep, endereco, cidade, bairro, uf, numCasa, complemento  } = req.body

    const usuario = await prisma.usuario.update({
      where: { id: id },
      data: {
        nickname: nickname,
        email: email,
        dados: {
          update: {
            nome: nome,
            telefone: telefone,
            cep: cep,
            endereco: endereco,
            cidade: cidade,
            bairro: bairro,
            uf: uf,
            numCasa: numCasa,
            complemento: complemento
          }
        }
      },
      include: {
        dados: true
      }
    });

    prisma.$disconnect()
    return res.status(200).json({ message: 'Dados do usuário atualizados com sucesso' });
  
  }
}