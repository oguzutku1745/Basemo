<?php

$wallet_address = $_POST['wallet_address'];
$expiry_date = $_POST['expiry_date'];
// Connect to the database
$conn = mysqli_connect('localhost', 'root', '', 'basemo');

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Prepare the data to be inserted

//echo $wallet_address;
//echo $expiry_date;



// Insert the data
//$sql = "INSERT INTO basemotest (Wallet_address, expirydate) VALUES ('$wallet_address', '$expiry_date')";

if($conn->connect_error){
    echo "$conn->connect_error";
    die("Connection Failed : ". $conn->connect_error);
} else {
    $stmt = $conn->prepare("insert into basemotest(Wallet_address, expirydate) values(?, ?)");
    $stmt->bind_param("ss", $wallet_address, $expiry_date);
    $execval = $stmt->execute();
    echo $execval;
    echo "Registration successfully...";
    $stmt->close();
    $conn->close();
}

// Close the connection
mysqli_close($conn);
?>
