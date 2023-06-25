import { PrismaClient } from "@prisma/client";


/* API Que Manipula os Sabores */

const prisma = new PrismaClient();

const getUniqueSabor = async (sabor) => {
    const Sabor = await prisma.sabor.findUnique({
      where: { sabor: sabor },
    });
    await prisma.$disconnect();
    return Sabor;
};

export default async function handleSabor(req, res) {

    //Pega todos Sabores
    if(req.method === "GET"){ 

        const sabores = await prisma.sabor.findMany({
            include: { produtos: true } //inclui os dados dos produtos relacionados
        });

        await prisma.$disconnect();
        return res.status(200).json(sabores)
    }
    //Cria Sabores
    else if(req.method === "PUT"){ 

        const { nomeSabor } = req.body;

        const verifySabor = await getUniqueSabor(nomeSabor)

        if(!verifySabor){
            const createSabor = await prisma.sabor.create({
                data:{
                    sabor: nomeSabor,
                }
            })
            await prisma.$disconnect();
            return res.status(201).json(createSabor)
        }else{
            await prisma.$disconnect();
            return res.status(401).json({ message: 'Esse sabor já existe' });
        }
    }
    //Edita os Sabores
    else if(req.method === "POST"){ 

        const { idSabor } = req.body;
        const { tipoSabor } = req.body;

        const verifySabor = await getUniqueSabor(tipoSabor)
      
        if(!verifySabor){
            const sabor = await prisma.sabor.update({
                where: { id: parseInt(idSabor) },
                data: { sabor: tipoSabor },
            });
            await prisma.$disconnect();
            res.status(200).json(sabor);
        }else{
            await prisma.$disconnect();
            return res.status(401).json({ message: 'Esse sabor já existe' });
        }

        

    }
    //Desativa ou ativa os Sabores
    else if(req.method === "DELETE"){ 

        const { idSabor } = req.body;
        const { disponibilidade } = req.body;

        const sabor = await prisma.sabor.update({
            where: { id: parseInt(idSabor) },
            data: { disponivel: !disponibilidade },
          });
          await prisma.$disconnect();
          res.status(200).json(sabor);

    } else{

        await prisma.$disconnect();
        res.status(405).json('Método não permitido')

    }
}