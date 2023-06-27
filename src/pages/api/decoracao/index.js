import { PrismaClient } from "@prisma/client";
import { getData } from "@/utils/formidable";
import { uploadImage } from "@/utils/cloudinary";



/* API Que Manipula as Decorações */

const prisma = new PrismaClient();


export const config = {
    api: {
        bodyParser: false,
    },
}


export default async function handleDecoracao(req, res) {

    //Pega todas Cores
    if(req.method === "GET"){ 

        const decoracoes = await prisma.decoracoes.findMany({
            include: {
                imagem: true,
            }
        });

        await prisma.$disconnect();
        return res.status(200).json(decoracoes)
    }
    //Cria Sabores
    else if(req.method === "PUT"){ 
        
        const data = await getData(req)

        const {registerImagem} = data.files
        
        if(data){
            const {registerImagem} = data.files
            
            if(registerImagem){
                
                try {
                    const Imagem = registerImagem[0].filepath
                    const imageData = await uploadImage(Imagem, null, true)
                    
                    const Decoracao = await prisma.$transaction(async (prisma) => {
                        const imagens = await prisma.imagens.create({
                            data: {
                                publicId: imageData.public_id,
                                format: imageData.format,
                                version: imageData.version.toString(),
                            },
                        });
                        
                        const decoracao = await prisma.decoracoes.create({
                            data:{
                                imagemId:imagens.id
                            }
                        });
                    });
                    
                    await prisma.$disconnect();
                    res.status(200).json({ dados: Decoracao })
                }
                catch (error) {

                    if (error.message.includes("File size too large")) {
                        await prisma.$disconnect();
                        res.status(400).json({ message: "Imagem muito grande" });
                    } else {
                        await prisma.$disconnect();
                        res.status(400).json({ error, message: "Ocorreu um erro." });
                    }
                }
            };

        }else{
            await prisma.$disconnect();
            res.status(400).json({ message: 'Ocorreu um erro.' })
        }
    }
    
    //Edita os Sabores
    else if(req.method === "POST"){ 

        const data = await getData(req)

        if(data){
            const { editImagemId, editImagemPublicId } = data.fields
            const { editImagem } = data.files

            if(editImagem){

                try {
                    const Imagem = editImagem[0].filepath;
            
                    const imageData = await uploadImage(Imagem, editImagemPublicId, true);
            
                    const updatedImagem = await prisma.imagens.update({
                      where: {
                        id: parseInt(editImagemId),
                      },
                      data: {
                        publicId: imageData.public_id,
                        format: imageData.format,
                        version: imageData.version.toString(),
                      },
                    });
            
                    await prisma.$disconnect();
                    res.status(200).json({ dados: updatedImagem });
                } 
                catch (error) {

                    if (error.message.includes("File size too large")) {
                        res.status(400).json({ message: "Imagem muito grande" });
                    } else {
                        res.status(400).json({ message: "Ocorreu um erro." });
                    }
                }
            }
            else{
                await prisma.$disconnect();
                res.status(400).json({ message: 'Ocorreu um erro.' })
            }

        }else{
            await prisma.$disconnect();
            res.status(400).json({ message: 'Ocorreu um erro.' })
        }

    }
   
    else{

        await prisma.$disconnect();
        res.status(405).json('Método não permitido')

    }
}