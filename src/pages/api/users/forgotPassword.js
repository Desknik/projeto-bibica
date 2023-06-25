import { PrismaClient } from "@prisma/client";
const nodemailer = require('nodemailer');


export default async function handler(req, res) {
    if (req.method === 'POST') {

        const prisma = new PrismaClient()
        const { email } = req.body;

        const generatePasswordResetToken = () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let token = '';
            
            for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            token += characters.charAt(randomIndex);
            }
            
            return token;
        }
        
        const token = generatePasswordResetToken()

        const user = await prisma.usuario.findUnique({
            where: {
                email: email,
            },
        });

        if (user) {
            await prisma.usuario.update({
                where: {
                    email: email,
                },
                data: {
                    tokenAlterarSenha: token,
                    dataExpiracaoToken: new Date(new Date().getTime() + 3600000).toISOString(), // Defina a expiração do token para 1 hora a partir do momento atual
                },
            });

            const transporter = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: "8c5f45717516b7",
                  pass: "ef470005bd3c17"
                }
            });

            const mailOptions = {
                from: 'seu-email@exemplo.com', // Remetente do e-mail
                to: email, // Destinatário do e-mail
                subject: 'Redefinição de senha', // Assunto do e-mail
                html: `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html>
                    <head>
                        <title>Nova mensagem</title>
                        <style type="text/css">
                        ul li, ol li {
                        margin-left:0;
                        }
                        .msohide {
                        mso-hide:all;
                        }
                        </style>
                    </head>
                    <body style="display:flex;justify-content:center;align-content:center">
                        <div class="box" style="padding:30px;border-radius:30px;background:#FAF4F6">
                            <h1 style="font-family:arial, 'helvetica neue', helvetica, sans-serif;text-align:center">Olá</h1>
                            <p style="font-family:arial, 'helvetica neue', helvetica, sans-serif;text-align:center">Você solicitou a redefinição de senha. Copie o token abaixo e use-o para redefinir sua senha:</p>
                            <div class="code-box" style="display:flex;flex-direction:column;justify-content:center;align-items:center">
                                <p class="code" style="font-family:arial, 'helvetica neue', helvetica, sans-serif;text-align:center;display:inline-block;font-size:18px;padding:10px;border-radius:5px;border:3px solid #DCDCF0">${token}</p>
                                <p style="font-family:arial, 'helvetica neue', helvetica, sans-serif;text-align:center">Se você não solicitou a redefinição de senha, ignore este e-mail.</p><a href="https://youtube.com" style="font-family:arial, 'helvetica neue', helvetica, sans-serif;text-align:center;font-size:18px;text-decoration:none;color:#FFFFFF;padding:5px 5px;border-radius:5px;background-color:#F472B6">Redefinir Senha</a>
                            </div>
                        </div>
                    </body>
                </html>
                `,
            };
    
            await transporter.sendMail(mailOptions);

        }else{
            res.status(400).json({ message: 'E-mail inválido' });
        }
    
    
        await prisma.$disconnect();
  
        res.status(200).json({ message: 'E-mail de recuperação de senha enviado!' });
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
  }