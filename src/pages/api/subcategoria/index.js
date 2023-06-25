import { PrismaClient } from "@prisma/client";


/* API Que Manipula as SubCategorias */

const prisma = new PrismaClient();

const getUniqueSubCategoria = async (idCategoria, subcategoria) => {
    const SubCategoria = await prisma.subCategoria.findFirst({
        where: {
          tipo: subcategoria,
          categoria: {
            id: idCategoria,
          },
        },
      });
      await prisma.$disconnect();
    return SubCategoria;
};

export default async function handleSubCategoria(req, res) {

    //Pega todas SubCategorias
    if(req.method === "GET"){ 

        const subCategories = await prisma.subCategoria.findMany({
            include: { produtos: true } //inclui os dados dos produtos relacionados
        });

        await prisma.$disconnect();
        return res.status(200).json(subCategories)
    }
    //Cria SubCategorias
    else if(req.method === "PUT"){ 

        const { idCategoria } = req.body;
        const { nomeSubCategoria } = req.body;

        const verifySubCategoria = await getUniqueSubCategoria(idCategoria, nomeSubCategoria)


        if(!verifySubCategoria){
            const createSubCategoria = await prisma.subCategoria.create({
                data:{
                    tipo: nomeSubCategoria,
                    categoriaId:idCategoria
                }
            })
            await prisma.$disconnect();
            return res.status(201).json(createSubCategoria)
        }else{
            await prisma.$disconnect();
            return res.status(401).json({ message: 'Essa subcategoria já existe' });
        }
    }
    //Edita as SubCategorias
    else if(req.method === "POST"){ 

        const { idSubCategoria } = req.body;
        const { tipoSubCategoria } = req.body;
        const { idCategoria } = req.body;

        const subCategoria = await prisma.subCategoria.update({
            where: { id: parseInt(idSubCategoria) },
            data: { 
                tipo: tipoSubCategoria,
                categoriaId: idCategoria
            },
        });
        await prisma.$disconnect();
        res.status(200).json(subCategoria)

    }
    //Desativa ou ativa as SubCategorias
    else if(req.method === "DELETE"){ 

        const { idSubCategoria } = req.body;
        const { disponibilidade } = req.body;

        const subCategoria = await prisma.subCategoria.update({
            where: { id: parseInt(idSubCategoria) },
            data: { disponivel: !disponibilidade },
          });
          await prisma.$disconnect();
          res.status(200).json(subCategoria);

    } else{

        await prisma.$disconnect();
        res.status(405).json('Método não permitido')

    }
}