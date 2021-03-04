<?php
    $subject = "Test Email";
    $message = "Blank";
    
    $headers .= "Reply-To: The Sender <n7b5gg@tensi.org>\r\n"; 
    $headers .= "Return-Path: The Sender <n7b5gg@tensi.org>\r\n"; 
    $headers .= "From: The Sender <n7b5gg@tensi.org>\r\n";  
    $headers .= "Organization: Sender Organization\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/plain; charset=iso-8859-1\r\n";
    $headers .= "X-Priority: 3\r\n";
    $headers .= "X-Mailer: PHP". phpversion() ."\r\n" ;
    
    mail("n7b5gg@tensi.org", $subject, $message, $headers);
?>