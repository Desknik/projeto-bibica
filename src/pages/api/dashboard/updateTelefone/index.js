import { PrismaClient } from "@prisma/client";


/* API Que Atualiza o Telefon */

const prisma = new PrismaClient();

export default async function handleCompra(req, res) {

    if(req.method === "POST"){

        const {numero} = req.body;

        const novoTelefone = await prisma.telefone.update({
            where:{id:1},
            data:{
                numero: numero
            }
        })
        
        await prisma.$disconnect();
        return res.status(200).json({numero: novoTelefone.numero});

    }else{
        await prisma.$disconnect();
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
}
