import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

// Configura la API Key de SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.error("⚠️  SENDGRID_API_KEY no está configurada");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("✓ SendGrid configurado correctamente");
}

export default sgMail;
