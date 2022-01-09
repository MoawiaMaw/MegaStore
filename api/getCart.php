<?php

include("config.php");

$result["cart"] = mysqli_query($con, "select * from cart");
$result["prices"] = mysqli_query($con, "select price from cart");
$data["cart"] = mysqli_fetch_all($result["cart"], MYSQLI_ASSOC);
$data["prices"] = mysqli_fetch_all($result["prices"], MYSQLI_ASSOC);

echo json_encode($data);

?>