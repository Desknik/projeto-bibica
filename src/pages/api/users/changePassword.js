import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { email, token, newPassword, confirmPassword } = req.body;

  try {
    // Verifica se o e-mail é válido
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: 'E-mail inválido' });
    }

    // Verifica se o token está correto
    if (user.tokenAlterarSenha !== token) {
        return res.status(400).json({ message: 'Token inválido' });
    }

    // Verifica se o token não expirou
    const currentTimestamp = new Date().getTime();
    if (user.dataExpiracaoToken < currentTimestamp) {
        return res.status(400).json({ message: 'Token expirado' });
    }

    // Verifica se a nova senha e a confirmação de senha são iguais
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'As senhas não correspondem' });
    }

    // Gera o hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha do usuário
    await prisma.usuario.update({
      where: { email },
      data: {
        senha: hashedPassword,
        tokenAlterarSenha: null,
        dataExpiracaoToken: null,
      },
    });

    
    return res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Ocorreu um erro ao processar a solicitação' });
  }finally{
    await prisma.$disconnect();
  }
}