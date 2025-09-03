<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $recipient = trim($_POST["recipient"]); // E-mail do dono do site (digitado pela visitante)
    $name      = trim($_POST["name"]);
    $email     = trim($_POST["email"]);     // E-mail da visitante
    $phone     = trim($_POST["phone"]);
    $message   = trim($_POST["message"]);

    if (preg_match("/[\r\n]/", $name) || preg_match("/[\r\n]/", $email) || preg_match("/[\r\n]/", $recipient)) {
        echo "Dados inválidos.";
        exit;
    }

    if (empty($recipient) || empty($name) || empty($email) || empty($phone) || empty($message)) {
        echo "Todos os campos são obrigatórios.";
        exit;
    }

    if (!filter_var($recipient, FILTER_VALIDATE_EMAIL) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Email inválido.";
        exit;
    }

    $subject = "Nova mensagem de contato";
    $headers = "From: no-reply@seudominio.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Return-Path: no-reply@seudominio.com\r\n";

    $body  = "Nome: $name\n";
    $body .= "Email da visitante: $email\n";
    $body .= "Celular: $phone\n";
    $body .= "Mensagem:\n$message\n";

    if (mail($recipient, $subject, $body, $headers, "-rno-reply@seudominio.com")) {
        echo "Mensagem enviada com sucesso!";
    } else {
        echo "Erro ao enviar a mensagem.";
    }
}
?>