<?php
$time = time();
$tempF = $_POST["temp"];
$voltF = $_POST["volt"];
$currF = $_POST["curr"];
$file = 'temp.html';
$data = "Timestamp=".$time."|Voltage=".$voltF."|Current=".$currF."|Temperature=".$tempF;
#file_put_contents($file, $data);
##echo $data;
$myfile = fopen("values.txt", "w") or die("Unable to open file!");
fwrite($myfile, $data);
?>
