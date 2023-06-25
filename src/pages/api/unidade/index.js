import { PrismaClient } from "@prisma/client";


/* API Que Manipula as Unidades */

const prisma = new PrismaClient();

const getUniqueUnidade = async (unidade) => {
    const Unidade = await prisma.unidadeMedida.findUnique({
      where: { tipo: unidade },
    });
    await prisma.$disconnect();
    return Unidade;
};

export default async function handleUnidade(req, res) {

    //Pega todos Sabores
    if(req.method === "GET"){ 

        const sabores = await prisma.unidadeMedida.findMany({
            include: { produtos: true } //inclui os dados dos produtos relacionados
        });

        await prisma.$disconnect();
        return res.status(200).json(sabores)
    }
    //Cria Sabores
    else if(req.method === "PUT"){ 

        const { nomeSabor } = req.body;

        const verifyUnidade = await getUniqueUnidade(nomeSabor)

        if(!verifyUnidade){
            const createSabor = await prisma.unidadeMedida.create({
                data:{
                    tipo: nomeSabor,
                }
            })
            await prisma.$disconnect();
            return res.status(201).json(createSabor)
        }else{
            await prisma.$disconnect();
            return res.status(401).json({ message: 'Essa unidade já existe' });
        }
    }
    //Edita as Unidades
    else if(req.method === "POST"){ 

        const { idUnidade } = req.body;
        const { tipoUnidade } = req.body;

        const verifyUnidade = await getUniqueUnidade(tipoUnidade)
      
        if(!verifyUnidade){
            const unidade = await prisma.unidadeMedida.update({
                where: { id: parseInt(idUnidade) },
                data: { tipo: tipoUnidade },
            });
            await prisma.$disconnect();
            res.status(200).json(unidade);
        }else{
            await prisma.$disconnect();
            return res.status(401).json({ message: 'Essa unidade já existe' });
        }

        

    }
    //Desativa ou ativa as Unidades
    else if(req.method === "DELETE"){ 

        const { idUnidade } = req.body;
        const { disponibilidade } = req.body;

        const unidade = await prisma.unidadeMedida.update({
            where: { id: parseInt(idUnidade) },
            data: { disponivel: !disponibilidade },
          });
          await prisma.$disconnect();
          res.status(200).json(unidade);

    } else{

        await prisma.$disconnect();
        res.status(405).json('Método não permitido')

    }
}