<?php




$server  = "localhost";
$username = "root";
$password = "";
$dbname = "data base";

$con = mysqli_connect($server, $username, $password, $dbname);

if(!$con)
{
    echo "not connected";
}  

// start
$email =$_POST["email"];
$password =$_POST["password"];

$sql = "INSERT INTO `user data`(`email`, `password`) VALUES ('$email','$password')";

$result = mysqli_query($con, $sql);

if($result)
{
    echo "data submited";
}
else
{
    echo "query failed....!";
}


// Agar form submit hua ho
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'] ?? '';
    echo "Name: " . htmlspecialchars($name);
}
?>

<form action="index.html" method="post">
    <input type="text" name="name" placeholder="Enter name">
    <button type="submit">Submit</button>
</form>



?>