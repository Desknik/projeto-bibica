import { PrismaClient } from "@prisma/client";


/* API Que Manipula as Compras */

const prisma = new PrismaClient();

export default async function handleCompra(req, res) {

    if(req.method === "POST"){

        const {selectedDate} = req.body
        const minToday = new Date();
        const maxToday = new Date();

        

        const dataMin = selectedDate.startDate !== undefined ? new Date(selectedDate.startDate) : minToday;
        dataMin.setHours(0, 0, 0, 0); // Definir horário para 00:00
        
        const dataMax = selectedDate.endDate !== undefined ? new Date(selectedDate.endDate) : maxToday;
        dataMax.setHours(23, 59, 59, 999); // Definir horário para 23:59

        // Obter o ganho por data dentro do intervalo especificado
        const ganhoData = await prisma.pedido.aggregate({
            _sum: {
                precoTotal: true,
            },
            where: {
                dataPagamento: {
                    gte: dataMin,
                    lt: dataMax,
                },
                pago: true
            },
        });
        
        await prisma.$disconnect();
        return res.status(200).json(ganhoData._sum.precoTotal || 0,)

    }else{
        await prisma.$disconnect();
        return res.status(401).json({ message: 'Ocorreu um erro' });
    }
}
