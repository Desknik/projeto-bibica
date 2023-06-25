import { PrismaClient } from "@prisma/client";


/* API Que Manipula as Compras */

const prisma = new PrismaClient();

export default async function handleCompra(req, res) {

    if(req.method === "GET"){

        const hoje = new Date();
        const currentDay = hoje.getDate();

        // Obtém o primeiro dia do mês atual
        const firstDayOfMonth = new Date(hoje.getFullYear(), hoje.getMonth(), 1);


        /* Lucro */

        // Obter o ganho no mês
        const ganhoMes = await prisma.pedido.aggregate({
            _sum: {
            precoTotal: true,
            },
            where: {
            dataPagamento: {
                gte: firstDayOfMonth, // Início do mês atual
                lt: hoje, // Fim do mês atual
            },
            pago: true, // Filtrar apenas os pedidos pagos
            },
        });

        // Obter o ganho diário (média dos últimos 7 dias)
        const ganhoDiario = await prisma.pedido.aggregate({
            _avg: {
            precoTotal: true,
            },
            where: {
            dataPagamento: {
                gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00Z', // 7 dias atrás
                lt: hoje, // Fim do dia atual
            },
            pago: true, // Filtrar apenas os pedidos pagos
            },
        });

        // Obter o ganho do dia atual
        const ganhoDia = await prisma.pedido.aggregate({
            _sum: {
            precoTotal: true,
            },
            where: {
            dataPagamento: {
                gte: new Date().toISOString().split('T')[0] + 'T00:00:00Z', // Início do dia atual
                lt: new Date().toISOString().split('T')[0] + 'T23:59:59Z', // Fim do dia atual
            },
            pago: true, // Filtrar apenas os pedidos pagos
            },
        });


        /* Vendas */
        
        
        // Query para buscar os pedidos do mês atual
        const vendasMes = await prisma.pedido.findMany({
            where: {
                dataPedido: {
                    gte: firstDayOfMonth, // A partir do primeiro dia do mês atual
                    lte: hoje,
                },
                pago:true,
                situacaoId:{
                    in: [ 3, 4, 5, 6]
                }
            },
            include: {
                detalhes: true, // Inclui os detalhes dos pedidos
            },
        });

        // Filtra os pedidos que foram feitos no dia atual
        const vendasDia = vendasMes.filter((pedido) => {
            const pedidoDay = pedido.dataPagamento.getDate();
            return pedidoDay === currentDay;
        });

        const seteDiasAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000); // Data de sete dias atrás

        // Obter as vendas recentes
        const vendasRecentes = await prisma.pedido.findMany({
            where: {
            dataPagamento: {
                gte: seteDiasAtras,
                lt: hoje,
            },
            situacaoId: {
                in: [3, 4, 5, 6, 7], // Situação ID 1, 2, 3, 4 e 5
            },
            pago:true
            },
            include: {
            usuario: {
                select: {
                dados: {
                    select: {
                    nome: true,
                    },
                },
                },
            },
            },
            orderBy: {
            dataPagamento: 'desc', // Ordenar por data de pedido descendente (mais recente primeiro)
            },
            take: 10, // Limitar a 10 vendas recentes
        });

        // Função para formatar as horas atrás
        function formatarHorasAtras(dataPedido) {
        const diffMilissegundos = hoje - dataPedido;
        const diffMinutos = Math.floor(diffMilissegundos / (1000 * 60));

        if (diffMinutos < 60) {
            if (diffMinutos === 1) {
                return 'Há 1 minuto';
            } else {
                return `Há ${diffMinutos} minutos`;
            }
            } else {
                const diffHoras = Math.floor(diffMinutos / 60);

                if (diffHoras < 24) {
                    if (diffHoras === 1) {
                        return 'Há 1 hora';
                    } else {
                        return `Há ${diffHoras} horas`;
                    }
                } else {
                    const diffDias = Math.floor(diffHoras / 24);

                    if (diffDias === 1) {
                        return 'Há 1 dia';
                    } else {
                        return `Há ${diffDias} dias`;
                    }
                }
            }
        }


        // Formatar as vendas recentes
        const vendasFormatadas = vendasRecentes.map((venda) => {
            const id = venda.id;
            const nomeCliente = venda.usuario.dados.nome;
            const precoVenda = (venda.precoTotal).toString();
            const horasAtras = formatarHorasAtras(venda.dataPedido);

            return {
            id,
            nomeCliente,
            precoVenda,
            horasAtras,
            };
        });


        /* Pedidos */
        const pedidos  = await prisma.pedido.findMany({
            where: {
            situacaoId: {
                in: [1, 2, 3, 4, 5]
            },
            },
            
            include:{
                detalhes: true,
                situacao: true,
                usuario: {
                    select:{
                    dados: {
                        select:{
                        nome: true,
                        telefone: true
                        }
                    }
                    }
                }
            }
        })

        // Converter a propriedade `dataPedido` para uma string
        const pedidosFormatados = pedidos
        .map((pedido) => {
            return {

            ...pedido,
            dataPedido: pedido.dataPedido.toISOString(),
            dataPagamento: pedido.dataPagamento? pedido.dataPagamento.toISOString() : null,
            dataEntrega: pedido.dataPagamento? pedido.dataPagamento.toISOString() : null,
            desconto: pedido.desconto ? pedido.desconto.toString() : null,
            precoTotal: pedido.precoTotal.toString(),
            detalhes: pedido.detalhes.map((detalhe) => ({
                ...detalhe,
                precoUnitario: detalhe.precoUnitario.toString(),
            })),

            };
        });

        const todosPedidos = await prisma.pedido.findMany(
            {
              include:{
                usuario:{
                  select:{
                    dados:{
                      select:{
                        nome:true
                      }
                    }
                  }
                },
                situacao:true,
                detalhes: {
                  include:{
                    produto: {select:{
                      nome: true,
                      imagem:true,
                      sabor:{select:{sabor:true}},
                      unidadeMedida:{select:{tipo: true}},
                      cor:{select:{cor: true}},
        
                    }}
                  }
                }
              }
            }
        )

        const todosPedidosFormatados = todosPedidos
        .sort((a, b) => b.id - a.id) // Ordenação decrescente pelo ID
        .map((pedido) => {
            return {
        
              ...pedido,
              dataPedido: pedido.dataPedido.toISOString(),
              dataPagamento: pedido.dataPagamento? pedido.dataPagamento.toISOString() : null,
              dataEntrega: pedido.dataEntrega? pedido.dataEntrega.toISOString() : null,
              desconto: pedido.desconto ? pedido.desconto.toString() : null,
              precoTotal: pedido.precoTotal.toString(),
              detalhes: pedido.detalhes.map(detalhe => ({
                ...detalhe,
                precoUnitario: detalhe.precoUnitario.toString(),
              })),
        
            };
          });




        const pedidosPendentes = pedidosFormatados.filter((pedido) => pedido.situacaoId === 1);

        /* Produtos */

        const produtosMaisVendidos = await prisma.produto.findMany({
            select: {
            id:true,
            nome: true,
            subCategoria: {
                select: {
                tipo: true,
                },
            },
            detalhesPedidos: {
                select: {
                    pedido: {
                        select: {
                        pago: true
                        }
                    },
                    quant:true
                }
            }
            },
            orderBy: {
                detalhesPedidos: {
                    _count: 'desc',
                },
            },
            take: 5,
        });

        // Filtra os resultados
        const produtosMaisVendidosFiltrados = produtosMaisVendidos
        .filter((produto) =>
            produto.detalhesPedidos.some((detalhe) => detalhe.pedido.pago === true)
        )
        .map((produto) => {

            const id = produto.id;
            const nomeProduto = produto.nome;
            const nomeSubCategoria = produto.subCategoria.tipo;
            const  quantidadeVendas = produto.detalhesPedidos
            .filter((detalhe) => detalhe.pedido.pago === true)
            .reduce((total, detalhe) => total + detalhe.quant, 0);

            const mensagemVendas = quantidadeVendas === 1 ? '1 venda' : `${quantidadeVendas} vendas`;


            return{
                id,
                nomeProduto,
                nomeSubCategoria,
                quantidadeVendas: mensagemVendas,
            };
        });
        
        await prisma.$disconnect();
        return res.status(200).json({
            ganhosMes: (ganhoMes._sum.precoTotal || 0).toString(),
            ganhosDiario: (ganhoDiario._avg.precoTotal || 0).toString(),
            ganhosDia: (ganhoDia._sum.precoTotal || 0).toString(),
      
            todosPedidos:todosPedidosFormatados,
            pedidos: pedidosFormatados,
            pedidosPendentes,
      
            vendasMes: vendasMes.length,
            vendasDia: vendasDia.length,
            vendasRecentes: vendasFormatadas,
      
            produtosMaisVendidos: produtosMaisVendidosFiltrados,
        });

    }else{
        await prisma.$disconnect();
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
}
