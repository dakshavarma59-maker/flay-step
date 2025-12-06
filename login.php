<?php
session_start();
include_once "libraries/vendor/autoload.php";
require_once 'vendor/autoload.php';

// init configuration
$clientID = '<252520616112-78q5kai338t24oeh8bki8mfh32op8uaq.apps.googleusercontent.com>';
$clientSecret = '<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>';
$redirectUri = '<https://flay-step.vercel.app>';

// create Client Request to access Google API
$client = new Google_Client();
$client->setClientId($clientID);
$client->setClientSecret($clientSecret);
$client->setRedirectUri($redirectUri);
$client->addScope("email");
$client->addScope("profile");

// authenticate code from Google OAuth Flow
if (isset($_GET['code'])) {
  $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
  $client->setAccessToken($token['access_token']);

  // get profile info
  $google_oauth = new Google_Service_Oauth2($client);
  $google_account_info = $google_oauth->userinfo->get();
  $email =  $google_account_info->email;
  $name =  $google_account_info->name;

  // now you can use this profile info to create account in your website and make user logged in.
} else {
  echo "<a href='".$client->createAuthUrl()."'>Google Login</a>";
}
?>