import { PrismaClient } from "@prisma/client";


/* API Que Manipula as Compras */

const prisma = new PrismaClient();

export default async function handleCompra(req, res) {

    if(req.method === "POST"){

        const {userId, removeAccess, ban} = req.body

        const usuario = await prisma.usuario.findUnique({
            where:{id: userId},
            select:{
                classeUsuarioId:true
            }
        })

        let classeUsuario = usuario.classeUsuarioId
        
        if(userId == true){
            classeUsuario = ! usuario.classeUsuarioId
        }

        

        await prisma.usuario.update({
            where: { id: userId },
            data: {
              classeUsuario:{
                connect:{
                    id: classeUsuario
                }
              },
              banido: ban
              
            },
        });
        
        
        await prisma.$disconnect();
        return res.status(200).json({ message: 'Situação do pedido atualizada com sucesso' });

    }else{
        await prisma.$disconnect();
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
}
