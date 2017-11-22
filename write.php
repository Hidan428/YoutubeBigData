<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$file = 'config.txt';
echo 'lol';
// Ouvre un fichier pour lire un contenu existant
// Ajoute une personne
$current = $_POST['donnee'];
// Écrit le résultat dans le fichier
file_put_contents($file, $current);
?>
