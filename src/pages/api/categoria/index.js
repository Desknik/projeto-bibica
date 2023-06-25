import { PrismaClient } from "@prisma/client";


/* API Que Manipula as Categorias */

const prisma = new PrismaClient();

const getUniqueCategoria = async (categoria) => {
    const Categoria = await prisma.categoria.findUnique({
      where: { tipo: categoria },
    });
    await prisma.$disconnect();
    return Categoria;
};

export default async function handleCategoria(req, res) {

    //Pega todas Categorias
    if(req.method === "GET"){ 

        const categories = await prisma.categoria.findMany({
            include: { produtos: true } //inclui os dados dos produtos relacionados
        });

        await prisma.$disconnect();
        return res.status(200).json(categories)
    }
    //Cria Categorias
    else if(req.method === "PUT"){ 

        const { nomeCategoria } = req.body;

        const verifyCategoria = await getUniqueCategoria(nomeCategoria)

        if(!verifyCategoria){
            const createCategoria = await prisma.categoria.create({
                data:{
                    tipo: nomeCategoria,
                }
            })
            await prisma.$disconnect();
            return res.status(201).json(createCategoria)
        }else{
            return res.status(401).json({ message: 'Essa categoria já existe' });
        }
    }
    //Edita as Categorias
    else if(req.method === "POST"){ 

        const { idCategoria } = req.body;
        const { tipoCategoria } = req.body;

        const verifyCategoria = await getUniqueCategoria(tipoCategoria)
      
        if(!verifyCategoria){
            const categoria = await prisma.categoria.update({
                where: { id: parseInt(idCategoria) },
                data: { tipo: tipoCategoria },
            });
            res.status(200).json(categoria);
        }else{
            await prisma.$disconnect();
            return res.status(401).json({ message: 'Essa categoria já existe' });
        }

        

    }
    //Desativa ou ativa as Categorias
    else if(req.method === "DELETE"){ 

        const { idCategoria } = req.body;
        const { disponibilidade } = req.body;

        const categoria = await prisma.categoria.update({
            where: { id: parseInt(idCategoria) },
            data: { disponivel: !disponibilidade },
          });
          await prisma.$disconnect();
          res.status(200).json(categoria);

    } else{
        await prisma.$disconnect();
        res.status(405).json('Método não permitido')

    }
}