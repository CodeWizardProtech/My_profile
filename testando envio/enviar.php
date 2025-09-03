<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = $_POST["nome"];
    $email = $_POST["email"];
    $mensagem = $_POST["mensagem"];

    $destinatario = "marcosbd337@gmail.com"; // Altere para o e-mail desejado
    $assunto = "Mensagem do site - $nome";
    $corpo = "Nome: $nome\nEmail: $email\nMensagem:\n$mensagem";
    $headers = "From: $email";

    if (mail($destinatario, $assunto, $corpo, $headers)) {
        echo "✅ Mensagem enviada com sucesso!";
    } else {
        echo "❌ Erro ao enviar a mensagem.";
    }
}
?>