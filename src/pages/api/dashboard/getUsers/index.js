import { PrismaClient } from "@prisma/client";


/* API Que Manipula as Compras */

const prisma = new PrismaClient();

export default async function handleCompra(req, res) {

    if(req.method === "GET"){

        const Usuarios = await prisma.usuario.findMany({
            include:{
              dados: true,
              pedidos:{
                select: {id:true}
              }
            }
          })

          const usuariosFormatados = Usuarios
          .sort((a, b) => b.id - a.id) // Ordenação decrescente pelo ID
          .map((usuario) => ({
            ...usuario,
            dataExpiracaoToken: usuario.dataExpiracaoToken?.toISOString() || null,
          }));
        
        await prisma.$disconnect();
        return res.status(200).json({
            Usuarios:usuariosFormatados
        });

    }else{
        await prisma.$disconnect();
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
}
