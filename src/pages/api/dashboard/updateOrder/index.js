import { PrismaClient } from "@prisma/client";


/* API Que Manipula as Compras */

const prisma = new PrismaClient();

export default async function handleCompra(req, res) {

    if(req.method === "POST"){

        const {pedidoId, situacaoId, descricao} = req.body

        const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });

        if (!pedido) {
          return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        let dataEntrega = null;
        let dataPagamento = null;
        let pago = false

        if (situacaoId > 2) {
          pago = true;
        }

        if (situacaoId > 2 && !pedido.dataPagamento) {
          dataPagamento = new Date();
        }

        if (!!pedido.dataPagamento) {
          dataPagamento = pedido.dataPagamento;
        }

        if (situacaoId === 6 ) {
          dataEntrega = new Date();
        }

        if (!!pedido.dataEntrega) {
          dataEntrega = pedido.dataEntrega;
        }

        if (situacaoId === 7 ) {
          pago = false
          dataPagamento = null
          dataEntrega = null
        }

        await prisma.pedido.update({
            where: { id: pedidoId },
            data: {
              situacao:{
                connect:{
                    id: situacaoId
                }
              },
              pago,
              dataPagamento,
              dataEntrega,
              descricao: descricao
            },
        });
        
        
        await prisma.$disconnect();
        return res.status(200).json({ message: 'Situação do pedido atualizada com sucesso' });

    }else{
        await prisma.$disconnect();
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
}
