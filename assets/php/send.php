<?php

// original author: John Benedict
// source: http://lab.benedictgraphico.com/web-design/simple-ajax-contact-form/

error_reporting(E_ALL);

function valid_email($str)
{
  return ( ! preg_match("/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/ix", $str)) ? FALSE : TRUE;
}

function isAjax() {
  return (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH']=="XMLHttpRequest");
} 

$from_email = "";
if( isset($_POST['Email']) )
{
  $from_email = $_POST['Email'];
} else {
  $from_email = "no-reply@greimdesign.de";
}

if($_POST['Username']!=""){
  // do nothing, this is supposedly spam
} else {
  if( valid_email($from_email)==TRUE && isset($_POST['Message']) && $_POST['Message']!="")
  {
    $to = 'welcome@greimdesign.de';
    $headers = 	'From: '.$from_email.''. "\r\n" .
      'Reply-To: '.$from_email.'' . "\r\n" .
      'X-Mailer: PHP/' . phpversion();
    $subject = "Anfrage von Webseite bzgl: " . htmlspecialchars($_POST['Subject']);
    $message = htmlspecialchars($_POST['Message']);
    $spam = $_POST['Username']; 

    if(mail($to, $subject, $message, $headers, "-f no-reply@greimdesign.de"))
    {
      if( isAjax() )
      {
        echo "Ihre Nachricht wurde erfolgreich versendet. Sofern gew&uuml;nscht, werden wir Ihnen im Laufe der n&auml;chsten Tage gerne antworten.";
      } else {
        header("Location: http://www.greimdesign.de/message-sent.html",TRUE,303);
      }
    }
    else {
      if( isAjax() )
      {
        echo "Leider konnte Ihre Nachricht nicht versendet werden. Bitte &uuml;berpr&uuml;fen Sie Ihre Angaben und versuchen Sie es noch einmal.";
      } else {
        header("Location: http://www.greimdesign.de/message-failed.html",TRUE,303);
      }			
    }
  }
  else {
    if( isAjax() )
    {
      echo "Leider konnte Ihre Nachricht nicht versendet werden. Bitte &uuml;berpr&uuml;fen Sie Ihre Angaben und versuchen Sie es noch einmal.";
    } else {
      header("Location: http://www.greimdesign.de/message-failed.html",TRUE,303);
    }
  }
}
?>
