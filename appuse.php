<?php
require("PHPMailer/src/PHPMailer.php");
require("PHPMailer/src/SMTP.php");

$usedate="";
$usetime="";
$bluser="";
$blsystem="";
if(isset($_POST['usedate'])){
  $usedate=$_POST['usedate'];
}
if(isset($_POST['usetime'])){
  $usetime=$_POST['usetime'];
}
if(isset($_POST['bluser'])){
  $bluser=$_POST['bluser'];
}
if(isset($_POST['blsystem'])){
  $blsystem=$_POST['blsystem'];
}

$message = "The ".$blsystem." system was used on ".$usedate." at ".$usetime." by ".$bluser.".";

$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
  $mail->IsSMTP(); // enable SMTP
  $mail->SMTPDebug = 0; // debugging: 0 = off (for production use), 1 = errors and messages, 2 = messages only
  $mail->SMTPAuth = true; // authentication enabled
  $mail->SMTPSecure = 'tls'; // ssl secure transfer enabled REQUIRED for Gmail
  $mail->Host = "smtp.gmail.com";
  $mail->Port = 587; // 465; 
  $mail->IsHTML(true);
  $mail->Username = "moonchild.rai@gmail.com";
  $mail->Password = "mCr!=aR7(";
  $mail->SetFrom("moonchild.rai@gmail.com","Avinash Rai");
  $mail->Subject = "Performance Log: ".$usedate." by ".$bluser;
  $mail->Body = $message;
  $mail->AddAddress("raistablet@gmail.com","Avinash Rai");
  $mail->send();
  $result=1;
  echo "Message sent!";
}  catch (Exception $e) {
  $result=2;
  echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
echo $result;
?>