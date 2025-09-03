<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Limpeza e Validação dos Dados
    $name = strip_tags(trim($_POST["name"]));
    $visitor_email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $recipient = filter_var(trim($_POST["recipient"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    // Verifica se os campos estão preenchidos e se os emails são válidos
    if (empty($name) || empty($message) ||
        !filter_var($visitor_email, FILTER_VALIDATE_EMAIL) ||
        !filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
        
        http_response_code(400);
        echo "Por favor, preencha todos os campos corretamente.";
        exit;
    }

    // 2. Montagem do Email
    $subject = "Nova mensagem do site - Enviada por: $name";

    // Corpo do email
    $email_body  = "Você recebeu uma nova mensagem do formulário de contato:\n\n";
    $email_body .= "Nome: $name\n";
    $email_body .= "Email de Contato: $visitor_email\n\n";
    $email_body .= "Mensagem:\n$message\n";

    // 3. Cabeçalhos otimizados
    $from_email = "devscienc@devscienc.criarsite.online"; // precisa ser um email válido do seu domínio
    $headers  = "From: $from_email\r\n";
    $headers .= "Reply-To: $visitor_email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 4. Envio do Email
    if (mail($recipient, $subject, $email_body, $headers)) {
        http_response_code(200);
        echo "Obrigado! Sua mensagem foi enviada com sucesso.";
    } else {
        http_response_code(500);
        echo "Oops! Ocorreu um erro no servidor e não foi possível enviar sua mensagem.";
    }

} else {
    // Se não for um POST, nega o acesso
    http_response_code(403);
    echo "Ocorreu um problema com seu envio, por favor, tente novamente.";
}
?>







<?php
/*if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name    = trim($_POST["name"]);
    $email   = trim($_POST["email"]);
    $message = trim($_POST["message"]);

    // Validação básica
    if (empty($name) || empty($email) || empty($message)) {
        echo "Todos os campos são obrigatórios.";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Email inválido.";
        exit;
    }

    // Envio do e-mail
    $to      = "seuemail@dominio.com";
    $subject = "Nova mensagem de contato";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Return-Path: $email\r\n";

    $body  = "Nome: $name\n";
    $body .= "Email: $email\n";
    $body .= "Mensagem:\n$message\n";

    mail($to, $subject, $body, $headers, "-r$email");
    echo "Mensagem enviada com sucesso!";
}*/
?>


 


