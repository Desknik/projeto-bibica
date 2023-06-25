import {getAllFilteredAtributesController} from '../../../controllers/getAllFilteredAtributes'


/* API Que Pega todos dados das caracteristicas de um produto filtrados */

export default async function getAllFilteredAtributes(req, res){
    
    if(req.method === "GET"){
        const filteredAtributes = await getAllFilteredAtributesController()
        return res.status(200).json( filteredAtributes /*{Categorias, SubCategorias, UnidadesMedida, Sabores, Cores}*/)
    }
}