import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mjml2html from "mjml";
import * as fs from "node:fs";
import path from "node:path";

dotenv.config();


const templates = {
    todoShared: path.resolve("../src/app/templates/todoShared.mjml"),
    passwordReset: path.resolve("../src/app/templates/passwordReset.mjml"),
    todoUnshared: path.resolve("../src/app/templates/todoUnshared.mjml"),
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    }
});

export const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        });
        console.log("Email sent to", to);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

export const renderShareTodoEmail = ({ ownerName, todoTitle, permission, todoLink }) => {
    try {
        // Read the MJML template
        const mjmlTemplate = fs.readFileSync(templates.todoShared, "utf-8");

        // Replace placeholders
        let mjmlContent = mjmlTemplate
            .replace("{{OWNER_NAME}}", ownerName)
            .replace("{{TODO_TITLE}}", todoTitle)
            .replace("{{PERMISSION}}", permission)
            .replace("{{TODO_LINK}}", todoLink);

        // Render MJML to HTML
        const { html } = mjml2html(mjmlContent);
        return html;
    } catch (error) {
        console.error("Error rendering MJML template:", error);
        throw error;
    }
};

export const renderTodoUnsharedEmail = ({ ownerName, todoTitle }) => {
    try {
        const mjmlTemplate = fs.readFileSync(templates.todoUnshared, "utf-8");

        let mjmlContent = mjmlTemplate
            .replace("{{OWNER_NAME}}", ownerName || "A user")
            .replace("{{TODO_TITLE}}", todoTitle || "Untitled Todo");

        const { html, errors } = mjml2html(mjmlContent, { validationLevel: "strict" });
        if (errors.length) {
            console.error("MJML rendering errors for todoUnshared:", errors);
        }

        return html;
    } catch (error) {
        console.error("Error rendering todoUnshared MJML template:", error);
        throw error;
    }
};

export const renderPasswordResetEmail = ({ resetLink }) => {
    try {
        // Read the MJML template
        const mjmlTemplate = fs.readFileSync(templates.passwordReset, "utf-8");

        // Replace placeholder
        let mjmlContent = mjmlTemplate.replace("{{RESET_LINK}}", resetLink || "#");

        // Render MJML to HTML
        const { html, errors } = mjml2html(mjmlContent, { validationLevel: "strict" });
        if (errors.length) {
            console.error("MJML rendering errors for passwordReset:", errors);
        }

        return html;
    } catch (error) {
        console.error("Error rendering passwordReset MJML template:", error);
        throw error;
    }
};