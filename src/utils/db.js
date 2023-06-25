import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/* Cria as Classes Admin e Cliente no Banco*/
async function createInitialClassUsers() {
  
  const adminUser = await prisma.classeUsuario.findUnique({ where: { tipo: "Admin" } });
  const clientUser = await prisma.classeUsuario.findUnique({ where: { tipo: "Client" } });

  if (!adminUser) {
    await prisma.classeUsuario.create({ data: { tipo: "Admin" } });
    await prisma.$disconnect();
  }

  if (!clientUser) {
    await prisma.classeUsuario.create({ data: { tipo: "Client" } });
    await prisma.$disconnect();
  }
}

async function createInitialSituations(){

  const pendente = await prisma.situacao.findUnique({ where: { situacao: "Pendente" } });
  const pagamento = await prisma.situacao.findUnique({ where: { situacao: "Aguardando pagamento" } });
  const andamento = await prisma.situacao.findUnique({ where: { situacao: "Em andamento" } });
  const transito = await prisma.situacao.findUnique({ where: { situacao: "Em trânsito" } });
  const retirado = await prisma.situacao.findUnique({ where: { situacao: "Aguardando ser retirado" } });
  const entregue = await prisma.situacao.findUnique({ where: { situacao: "Entregue" } });
  const cancelado = await prisma.situacao.findUnique({ where: { situacao: "Cancelado" } });

  await prisma.$disconnect();

  if(!pendente){
    await prisma.situacao.create({data: {situacao: "Pendente"}})
  }

  if(!pagamento){
    await prisma.situacao.create({data: {situacao: "Aguardando pagamento"}})
  }
  if(!andamento){
    await prisma.situacao.create({data: {situacao: "Em andamento"}})
  }

  if(!transito){
    await prisma.situacao.create({data: {situacao: "Em trânsito"}})
  }

  if(!retirado){
    await prisma.situacao.create({data: {situacao: "Aguardando ser retirado"}})
  }

  if(!entregue){
    await prisma.situacao.create({data: {situacao: "Entregue"}})
  }

  if(!cancelado){
    await prisma.situacao.create({data: {situacao: "Cancelado"}})
  }

}

async function createInitialuser(){

  const GlobalAdmin = await prisma.usuario.findFirst({where: {classeUsuarioId: 1}})

  const globalAdminNickname = process.env.GLOBAL_ADMIN_NICKNAME;
  const globalAdminEmail = process.env.GLOBAL_ADMIN_EMAIL;
  const globalAdminPassword = process.env.GLOBAL_ADMIN_PASSWORD;

  const hashedPassword = await bcrypt.hash(globalAdminPassword, 10); //Criptografa a senha enviada à API

  if(!GlobalAdmin){
    await prisma.usuario.create({data: {

      nickname: globalAdminNickname,
      email: globalAdminEmail,
      senha: hashedPassword,
      classeUsuario: {
        connect: { id: 1 }
      },
      dados: {
        create: {}
      }
      
      
    }})
    await prisma.$disconnect();
  }

  const pendente = await prisma.situacao.findUnique({ where: { situacao: "Pendente" } });
  const pagamento = await prisma.situacao.findUnique({ where: { situacao: "Aguardando pagamento" } });
  const andamento = await prisma.situacao.findUnique({ where: { situacao: "Em andamento" } });
  const transito = await prisma.situacao.findUnique({ where: { situacao: "Em trânsito" } });
  const retirado = await prisma.situacao.findUnique({ where: { situacao: "Aguardando ser retirado" } });
  const entregue = await prisma.situacao.findUnique({ where: { situacao: "Entregue" } });
  const cancelado = await prisma.situacao.findUnique({ where: { situacao: "Cancelado" } });

  await prisma.$disconnect();
  
  if(!pendente){
    await prisma.situacao.create({data: {situacao: "Pendente"}})
  }

  if(!pagamento){
    await prisma.situacao.create({data: {situacao: "Aguardando pagamento"}})
  }
  if(!andamento){
    await prisma.situacao.create({data: {situacao: "Em andamento"}})
  }

  if(!transito){
    await prisma.situacao.create({data: {situacao: "Em trânsito"}})
  }

  if(!retirado){
    await prisma.situacao.create({data: {situacao: "Aguardando ser retirado"}})
  }

  if(!entregue){
    await prisma.situacao.create({data: {situacao: "Entregue"}})
  }

  if(!cancelado){
    await prisma.situacao.create({data: {situacao: "Cancelado"}})
  }

}

export {createInitialClassUsers, createInitialSituations, createInitialuser};
