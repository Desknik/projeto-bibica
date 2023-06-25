import { PrismaClient } from "@prisma/client";

  
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

/* API Que Deleta as Decorações */

const prisma = new PrismaClient();

export default async function handleDeleteDecoracao(req, res) {

    
    if(req.method === "DELETE"){
        const {publicIdImagem} = req.body;

        const imagem = await prisma.imagens.findUnique({
            where: { publicId: publicIdImagem },
            include: { decoracoes: true },
        });
        
      
        if (!imagem) {
            return res.status(404).json({ message: 'Imagem não encontrada' });
        }

        try {
            const Decoracao = await prisma.$transaction(async (prisma) => {

                const decoracao = await prisma.decoracoes.deleteMany({
                    where: {
                      imagemId: imagem.id,
                    },
                });

                const imagens = await prisma.imagens.delete({
                    where: { publicId: publicIdImagem },
                });
              
                const result = await cloudinary.uploader.destroy(publicIdImagem);

                if (result.result !== 'ok') {
                    await prisma.$disconnect();
                    return res.status(500).json({ message: 'Erro ao excluir a imagem do Cloudinary' });
                }
            });
      
            await prisma.$disconnect();
            return res.status(204).send();
            
        } 
        catch (error) {
            await prisma.$disconnect();

            return res.status(500).json({ message: 'Erro ao excluir a imagem do banco de dados' });
        }
    }
      
    await prisma.$disconnect();
    return res.status(404).json({ message: 'Rota não encontrada' });
}