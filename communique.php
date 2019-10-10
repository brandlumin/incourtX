<?php
// require("PHPMailer-mailer/src/PHPMailer.php");
require("PHPMailer/src/PHPMailer.php");
// require("PHPMailer-mailer/src/SMTP.php");
require("PHPMailer/src/SMTP.php");

$currUpdate="";
$currTime="";
$currDate="";
$currInstance=1;
if(isset($_POST['currUpdate'])){
  $currUpdate=$_POST['currUpdate'];
}
if(isset($_POST['currTime'])){
  $currTime=$_POST['currTime'];
}
if(isset($_POST['currDate'])){
  $currDate=$_POST['currDate'];
}
if(isset($_POST['currInstance'])){
  $currInstance=$_POST['currInstance'];
}
$body = preg_match('/not/', $currUpdate, $matches);
$body2 = preg_match('/not/', $currUpdate, $matches);
$result=0;

if ($body2 == 0) { // 0 i.e. taken
  // for myself
  $body = "medicines were <strong>".$currUpdate."</strong> at ".$currTime." on ".$currDate.". ";
  // for the kaandi
  $subject2 = "And you made our day!";
  $body2 = "<p><strong>Thank you very much</strong> for being on a healthy path. God bless you.</p> ";
} else { // 1 i.e. not taken
  // for tester
  $body = "medicines were <strong>".$currUpdate."</strong> by ".$currTime." on ".$currDate.". ";
  // for recipient
  if ($currInstance != 2) {
    $subject2 = "Medicines! Please take them";
    $body2 = "<p>It seems a busy day today! Perhaps remember that inCourt is not your own business. You may also appreciate that taking medicines timely helps you in many ways as well as it keeps people, who care for you, at peace.</p> <p>Taking medicines is only investing in your better tomorrow. Please keep doing so. Please find some time out for it now.</p> <p>Looking forward...</p> ";
  } else {
    $subject2 = "Hmmmmm... We see";
    $body2 = "<p>Taking 5 minutes out to take medicine in 60 minutes was a challenge, really? On the other hand, having to insist twice more than often proves to be challenging one's stubbornness.</p> <p>Either way, we shouldn't trouble you anymore then.</p> ";
  }
}
$altBody = strip_tags($body);
$altBody2 = strip_tags($body2);




$mail = new PHPMailer\PHPMailer\PHPMailer();

try {
  $mail->IsSMTP(); // enable SMTP
  $mail->SMTPDebug = 2; // debugging: 0 = off (for production use), 1 = errors and messages, 2 = messages only
  $mail->SMTPAuth = true; // authentication enabled
  $mail->SMTPSecure = 'tls'; // ssl secure transfer enabled REQUIRED for Gmail
  $mail->Host = "smtp.gmail.com";
  $mail->Port = 587; // 465; 
  $mail->IsHTML(true);
  $mail->Username = "moonchild.rai@gmail.com";
  $mail->Password = "mCr!=aR7(";
  $mail->SetFrom("moonchild.rai@gmail.com","Avinash Rai");
  $mail->Subject = "Update received";
  $mail->Body = "<p>Hi,</p> <p>We got the status:</p> <p>The ".$body."</p>";
  $mail->AltBody = strip_tags("<p>Hi,</p> <p>We got the status:</p> <p>The ".$body."</p>");
  $mail->AddAddress("raistablet@gmail.com","Avinash Rai");
  $mail->send();
  $result=1;
  echo "Message sent!";
}  catch (Exception $e) {
  $result=2;
  echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
try {
  $mail->ClearAllRecipients();
  $mail->Username = "raistablet@gmail.com";
  $mail->Password = "mCr!=aR7(";
  $mail->SetFrom("raistablet@gmail.com","Avinash Rai");
  $mail->Subject = $subject2;
  $mail->Body = "<p>Hellos,<p/> <p>We see that the ".$body."</p> ".$body2;
  $mail->AltBody = strip_tags("<p>Hellos,<p/> <p>We see that the ".$body."</p> ".$body2);
  // $mail->AddAddress("sonal@lawyered.in","Sonal Dubey");
  $mail->AddBCC("avinash@brandlumin.com","Avinash Rai");
  $mail->send();
  $result=1;
  echo "Message sent!";
}  catch (Exception $e) {
  $result=2;
  echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
echo $result;
?>
