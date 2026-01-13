import sgMail from "../config/nodemailer";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM!,
      subject: "Verifica tu cuenta en Purrfect IELTS",
      text: `Hola ${user.name}, confirma tu cuenta en Purrfect IELTS`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hola ${user.name},</h2>
          <p>Has creado tu cuenta en Purrfect IELTS. Ya casi está todo listo, solo debes confirmar tu cuenta para comenzar a usar la plataforma.</p>
          <p>Visita el siguiente enlace:</p>
          <a 
            href="${process.env.FRONTEND_URL}/auth/confirm-account"
            style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;"
          >
            Confirmar Cuenta
          </a>
          <p>O ingresa el código manualmente: <strong style="font-size: 20px; color: #4F46E5;">${user.token}</strong></p>
          <p>Este token expira en 10 minutos</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Si tú no creaste esta cuenta, puedes ignorar este mensaje
          </p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log("✓ Email de confirmación enviado a:", user.email);
    } catch (error: any) {
      console.error("Error enviando email de confirmación:", error);
      if (error.response) {
        console.error("Detalles del error:", error.response.body);
      }
      throw new Error("Error al enviar el email de confirmación");
    }
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM!,
      subject: "Restablece tu contraseña en Purrfect IELTS",
      text: `Hola ${user.name}, has solicitado restablecer tu contraseña`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hola ${user.name}</h2>
          <p>Has solicitado restablecer tu contraseña.</p>
          <p>Visita el siguiente enlace:</p>
          <a 
            href="${process.env.FRONTEND_URL}/auth/new-password" 
            style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;"
          >
            Restablecer Contraseña
          </a>
          <p>O ingresa el código manualmente: <strong style="font-size: 20px; color: #4F46E5;">${user.token}</strong></p>
          <p>Este token expira en 10 minutos</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Si tú no solicitaste este cambio, puedes ignorar este mensaje
          </p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log("✓ Email de restablecimiento enviado a:", user.email);
    } catch (error: any) {
      console.error("Error enviando email de restablecimiento:", error);
      if (error.response) {
        console.error("Detalles del error:", error.response.body);
      }
      throw new Error("Error al enviar el email de restablecimiento");
    }
  };
}
