import { PrismaClient } from "@prisma/client";
import { getData } from "@/utils/formidable";
import { uploadImage } from "@/utils/cloudinary";


const prisma = new PrismaClient();

export const config = {
    api: {
     bodyParser: false,
    },
   }

const getUniqueProduct = async (nome) => {
    const Sabor = await prisma.produto.findUnique({
      where: { nome: nome },
    });
    return Sabor;
};

export default async function handleProducts(req, res){
     //Pega todos produtos
     if(req.method === "GET"){ 

        const Produtos = await prisma.produto.findMany({
            include: {
                imagem: true,
                categoria: {
                    select: {
                    tipo: true,
                    },
                },
                subCategoria: {
                    select: {
                    tipo: true,
                    },
                },
                unidadeMedida: {
                    select: {
                    tipo: true,
                    },
                },
                sabor: {
                    select: {
                    sabor: true,
                    },
                },
                cor: {
                    select: {
                    cor: true,
                    },
                },
                detalhesPedidos: {
                    select: {
                    id: true
                    },
                }
            },
        });
    
        const produtosFormatados = Produtos
        .sort((a, b) => b.id - a.id) // Ordenação decrescente pelo ID
        .map((produto) => {
            return {
              ...produto,
              precoUnitario: produto.precoUnitario.toString(),
            };
          });

        await prisma.$disconnect();
        return res.status(200).json({Produtos:produtosFormatados})
    }
    else if(req.method === "PUT"){ 

        const data = await getData(req)

        if(data){
            const {registerProduto, registerCategoria, registerSubCategoria, registerUnidade, registerSabor, registerCor, registerDescricao, registerPreco} = data.fields
            const {registerImagem} = data.files
            
            
            if (!registerProduto || registerProduto == "") {
                return res.status(400).json({ message: 'O campo "Produto" está vazio' });
            }
            
            if (!registerCategoria) {
                return res.status(400).json({ message: 'O campo "Categoria" está vazio' });
            }
            
            if (!registerSubCategoria) {
                return res.status(400).json({ message: 'O campo "SubCategoria" está vazio' });
            }
            
            if (!registerUnidade) {
                return res.status(400).json({ message: 'O campo "Unidade de Medida" está vazio' });
            }
            
            if (!registerSabor) {
                return res.status(400).json({ message: 'O campo "Sabor" está vazio' });
            }
            
            if (!registerCor) {
                return res.status(400).json({ message: 'O campo "Cor" está vazio' });
            }
            
            if (!registerPreco) {
                return res.status(400).json({ message: 'O campo "Preço" está vazio' });
            }
            
            if (!registerDescricao) {
                return res.status(400).json({ message: 'O campo "Descrição" está vazio' });
            }
            
            if (!registerImagem) {
                return res.status(400).json({ message: 'O campo "Imagem" está vazio' });
            }
            
            const Imagem = registerImagem.filepath
            const imageData = await uploadImage(Imagem)
            
           
            const Produto = await prisma.$transaction(async (prisma) => {
                const imagens = await prisma.imagens.create({
                  data: {
                    publicId: imageData.public_id,
                    format: imageData.format,
                    version: imageData.version.toString(),
                  },
                });
              
                const produto = await prisma.produto.create({
                    data:{
                        nome: registerProduto,
                        categoriaId: parseInt(registerCategoria),
                        subCategoriaId: parseInt(registerSubCategoria),
                        unidadeMedidaId: parseInt(registerUnidade),
                        saborId: parseInt(registerSabor),
                        corId: parseInt(registerCor),
                        descricao: registerDescricao,
                        imagemId:imagens.id,
                        precoUnitario: parseFloat(registerPreco)
                    }
                })
              });
    
              await prisma.$disconnect();
              res.status(200).json({ dados: Produto })

        }else{
            await prisma.$disconnect();
            res.status(400).json({ message: 'Ocorreu um erro.' })
        }
        
    } 
    else if(req.method === "POST"){

        const data = await getData(req);

        if(data) {
            const { editProdutoID, editProduto, editCategoria, editSubCategoria, editUnidade, editSabor, editCor, editDescricao, editPreco, editImagemPublicId } = data.fields;
            const { editImagem } = data.files;

            if (!editProduto) {
                return res.status(400).json({ message: 'O campo "Produto" está vazio' });
            }
            
            if (!editCategoria) {
                return res.status(400).json({ message: 'O campo "Categoria" está vazio' });
            }
            
            if (!editSubCategoria) {
                return res.status(400).json({ message: 'O campo "SubCategoria" está vazio' });
            }
            
            if (!editUnidade) {
                return res.status(400).json({ message: 'O campo "Unidade de Medida" está vazio' });
            }
            
            if (!editSabor) {
                return res.status(400).json({ message: 'O campo "Sabor" está vazio' });
            }
            
            if (!editCor) {
                return res.status(400).json({ message: 'O campo "Cor" está vazio' });
            }
            
            if (!editPreco) {
                return res.status(400).json({ message: 'O campo "Preço" está vazio' });
            }
            
            if (!editDescricao) {
                return res.status(400).json({ message: 'O campo "Descrição" está vazio' });
            }
       
            const updatedProduto = await prisma.produto.update({
                where: {
                id: parseInt(editProdutoID)
                },
                data: {
                nome: editProduto,
                categoriaId: parseInt(editCategoria),
                subCategoriaId: parseInt(editSubCategoria),
                unidadeMedidaId: parseInt(editUnidade),
                saborId: parseInt(editSabor),
                corId: parseInt(editCor),
                descricao: editDescricao,
                precoUnitario: parseFloat(editPreco)
                }
            });
      
            if(editImagem){

                const Imagem = editImagem.filepath;

                const imageData = await uploadImage(Imagem, editImagemPublicId);
        
                const updatedImagem = await prisma.imagens.update({
                    where: {
                    id: updatedProduto.imagemId
                    },
                    data: {
                    publicId: imageData.public_id,
                    format: imageData.format,
                    version: imageData.version.toString()
                    }
                });
            }
          
            await prisma.$disconnect();
            res.status(200).json({ dados: updatedProduto });
        } 
        else {
            await prisma.$disconnect();
            res.status(400).json({ message: 'Ocorreu um erro.' });
        }
        
    } 
    else if(req.method === "DELETE"){

        const data = await getData(req);

        if(data) {

            const { productId, disponibilidade } = data.fields;

            const updatedProduto = await prisma.produto.update({
                where: { id: parseInt(productId) },
                data: { disponivel: !disponibilidade }
            });
            await prisma.$disconnect();
            res.status(200).json({ dados: updatedProduto });
            
        }

        
    }
    else{
        await prisma.$disconnect();
        res.status(405).json('Método não permitido')

    }
}

