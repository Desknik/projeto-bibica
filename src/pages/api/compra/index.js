import { PrismaClient } from "@prisma/client";


/* API Que Manipula as Compras */

const prisma = new PrismaClient();

export default async function handleCompra(req, res) {

    if(req.method === "PUT"){

        const {idUsuario, metodoEntrega, produtos, desconto, precoTotal} = req.body
       
        const dataPedido = new Date();
        
        if(!!idUsuario && !!metodoEntrega && !!produtos && produtos.length > 0 && !!precoTotal){
            
            const pedido = await prisma.pedido.create({
                data: {
                    usuario: {
                        connect: { id: idUsuario}
                    },

                    metodoEntrega,
                    dataPedido,
                    desconto: parseFloat(desconto.toFixed(2)),
                    precoTotal: parseFloat(precoTotal.toFixed(2)),
                    
                    detalhes: {
                    create: produtos.map((produto) => ({
                        produtoId: produto.id,
                        quant: produto.quantidade,
                        precoUnitario: parseFloat(produto.precoUnitario),
                    })),
                    },
                    
                },
            });

            const usuario = await prisma.usuario.findUnique({
                where:{
                    id: pedido.usuarioId
                },
                select:{
                    dados:{
                        select:{
                            nome:true
                        }
                    }
                }
            })

            const nomeCompleto = usuario.dados.nome;
            const partesNome  = nomeCompleto.split(" ");

            let nomeFormatado = "";

            if (partesNome.length > 1) {
                const segundoItem = partesNome[1];
                if (segundoItem.length === 2 || segundoItem.length === 3) {
                nomeFormatado = partesNome.slice(0, 3).join(" "); // Inclui primeiro nome + (da, de, dos) + sobrenome
                } else {
                nomeFormatado = partesNome.slice(0, 2).join(" "); // Iclui nome e sobre nome
                }
            } else {
                nomeFormatado = partesNome[0]; // Se houver apenas um nome, mantém o primeiro nome
            }

            const codigoPedido = pedido.id
            const telefone = 11968037722

            await prisma.$disconnect();
            return res.status(201).json({ nome:nomeFormatado, codigoPedido, telefone })

        }else{
            await prisma.$disconnect();
            return res.status(401).json({ message: 'Ocorreu um erro' });
        }
    }
}