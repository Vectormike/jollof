<?php
// required headers for Api Call
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$response = [];
$entityBody = file_get_contents('php://input'); // receives raw input from the request
$user_found = false;

//    $email       = $_POST['email'];
//    $password    = $_POST['password'];
   
  
  
   $data        = file_get_contents(__DIR__.'/../../auth.json'); 
   $data        = json_decode($data,true);
    try {
    $entityBody_json = json_decode($entityBody,true); //decodes the raw response and converts it to json so we can access it with keys
    
    $email = $entityBody_json['email']; //assign to email
    $password = $entityBody_json['password']; //assign to password
    if ($email == "" or $password == ""){
        
    } else {
    foreach($data['users'] as $user)
    {
        $userEmail  = $user['email'];
        $userPass   = $user['password'];
        
        if( ($userEmail === $email && $userPass === $password) ) {
            $response = [
                'id'        => $user['id'],
                'name'      => $user['name'],
                'username'  => $user['username'],
                'email'     => $user['email'],
                'avatar'    => $user['avatar'],
                'status'    => $user['status'],
            ];

            $response_json = json_encode(['authenticated'=>true,'user' => $response],true);
            $user_found = true;


            break;  //breaks out of the loop as soon as there is a match
            
        }
    }
}
    } catch(exception $e){
    }

    if(!$user_found){
        $message = "Input fields cannot be empty!";
        header('HTTP/1.1 401 Unauthorized');
        echo json_encode(['authenticated'=>false,'status' => 401,'message' => $message]);
    }else{
        echo $response_json;
    }
        


