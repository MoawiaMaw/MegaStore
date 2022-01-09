<?php
include("config.php");

$name = $_POST["name"];
$section = $_POST["section"];
$id = $_POST["id"];
$price = $_POST["price"];
$image = $_POST["image"];

// step 1

$resp["status"] = mysqli_query($con, "insert into cart(name, section, quantity, price, product_id, image) values('$name','$section','1','$price','$id','$image')"); // step 2 & 3

echo json_encode($resp); // step 4



?>