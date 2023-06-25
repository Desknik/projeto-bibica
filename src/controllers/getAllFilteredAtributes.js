import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllFilteredAtributesController = async () => {

    const categorias = await prisma.categoria.findMany({
        select: {
            id: true,
            tipo: true,
            disponivel: true
        },
    });

    const Categorias = categorias.map(categoria => ({ id:categoria.id ,name: categoria.tipo, disponivel: categoria.disponivel }));
    const CategoriasDisponiveis = Categorias.filter(categoria => (categoria.disponivel));

    const subCategorias = await prisma.subCategoria.findMany({

        select: {
            id: true,
            tipo: true,
            disponivel: true,
            categoriaId: true
        },
    });

    const SubCategorias = subCategorias.map(subcategoria => ({ id:subcategoria.id ,name: subcategoria.tipo, disponivel: subcategoria.disponivel, categoria: subcategoria.categoriaId  }));
    const SubCategoriasDisponiveis = SubCategorias.filter(subCategoria => (subCategoria.disponivel));

    const unidadesMedida = await prisma.unidadeMedida.findMany({
        select: {
            id: true,
            tipo: true,
            disponivel: true
        },
    });

    const UnidadesMedida = unidadesMedida.map(unidade => ({ id:unidade.id ,name: unidade.tipo, disponivel: unidade.disponivel  }));
    const UnidadesDisponiveis = UnidadesMedida.filter(unidade => (unidade.disponivel));

    const sabores = await prisma.sabor.findMany({
        select: {
            id: true,
            sabor: true,
            disponivel: true
        },
    });

    const Sabores = sabores.map(sabor => ({ id:sabor.id ,name: sabor.sabor, disponivel: sabor.disponivel }));
    const SaboresDisponiveis = Sabores.filter(sabor => (sabor.disponivel));

    const cores = await prisma.cor.findMany({
        select: {
            id: true,
            cor: true,
            disponivel: true
        }
    });

    const Cores = cores.map(cor => ({ id:cor.id ,name: cor.cor, disponivel: cor.disponivel }));
    const CoresDisponiveis = Cores.filter(cor => (cor.disponivel));


    await prisma.$disconnect();
    return{Categorias, CategoriasDisponiveis, SubCategorias, SubCategoriasDisponiveis, UnidadesMedida, UnidadesDisponiveis, Sabores, SaboresDisponiveis, Cores, CoresDisponiveis}
};