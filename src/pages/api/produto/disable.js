import { getData } from "@/utils/formidable";
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

    //Desativa ou ativa os Sabores
    if(req.method === "POST"){

        const {productId, disponibilidade} = req.body

        if(productId != undefined && productId != null && disponibilidade != undefined && disponibilidade != null) {

            const updatedProduto = await prisma.produto.update({
                where: { id: parseInt(productId) },
                data: { disponivel: !disponibilidade }
            });
            await prisma.$disconnect();
            res.status(200).json({ dados: updatedProduto });
            
        }
        else{
            await prisma.$disconnect();
            res.status(401).json({ message: "Ocorreu um erro"})
        }

        
    }
      
    await prisma.$disconnect();
    return res.status(404).json({ message: 'Rota não encontrada' });
}