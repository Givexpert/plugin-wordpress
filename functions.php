<?php
function formatBaseApiUrl($baseUrl){

    if (  $baseUrl[strlen($baseUrl) - 1] =="\\") {
    
        return   substr_replace($baseUrl, "", -1)."/";
    }
    if ( $baseUrl[strlen($baseUrl) - 1] !="/") {
        return  $baseUrl."/";
    }   

    return $baseUrl;
}
?>