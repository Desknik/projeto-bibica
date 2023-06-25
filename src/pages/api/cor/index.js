import { PrismaClient } from "@prisma/client";


/* API Que Manipula as Cores */

const prisma = new PrismaClient();

const getUniqueCor = async (cor) => {
    const Sabor = await prisma.cor.findUnique({
      where: { cor: cor },
    });
    await prisma.$disconnect();
    return Sabor;
};

export default async function handleSabor(req, res) {

    //Pega todas Cores
    if(req.method === "GET"){ 

        const sabores = await prisma.cor.findMany({
            include: { produtos: true } //inclui os dados dos produtos relacionados
        });

        await prisma.$disconnect();
        return res.status(200).json(sabores)
    }
    //Cria Sabores
    else if(req.method === "PUT"){ 

        const { nomeCor } = req.body;

        const verifySabor = await getUniqueCor(nomeCor)

        if(!verifySabor){
            const createCor = await prisma.cor.create({
                data:{
                    cor: nomeCor,
                }
            })
            await prisma.$disconnect();
            return res.status(201).json(createCor)
        }else{
            await prisma.$disconnect();
            return res.status(401).json({ message: 'Essa cor já existe' });
        }
    }
    //Edita os Sabores
    else if(req.method === "POST"){ 

        const { idCor } = req.body;
        const { tipoCor } = req.body;

        const verifySabor = await getUniqueCor(tipoCor)
      
        if(!verifySabor){
            const cor = await prisma.cor.update({
                where: { id: parseInt(idCor) },
                data: { cor: tipoCor },
            });
            await prisma.$disconnect();
            res.status(200).json(cor);
        }else{
            await prisma.$disconnect();
            return res.status(401).json({ message: 'Essa cor já existe' });
        }

        

    }
    //Desativa ou ativa os Sabores
    else if(req.method === "DELETE"){ 

        const { idCor } = req.body;
        const { disponibilidade } = req.body;

        const cor = await prisma.cor.update({
            where: { id: parseInt(idCor) },
            data: { disponivel: !disponibilidade },
          });
          res.status(200).json(cor);

    } else{

        res.status(405).json('Método não permitido')

    }
}