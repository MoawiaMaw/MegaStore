<?php
include("config.php");

$data =json_decode(file_get_contents("php://input"),true);
$id = $_POST["id"];
$price = $_POST["price"];
// step 1

$resp["status"] = mysqli_query($con, "update cart set quantity= quantity + 1, price = price + '$price'  where id=$id"); // step 2 & 3

echo json_encode($resp); // step 4


?>