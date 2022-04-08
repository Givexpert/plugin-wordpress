<?php
function give_xpert_cookies_management()
{

    $utm_medium  =  isset($_GET['utm_medium']) ? htmlspecialchars(stripslashes($_GET['utm_medium'])) : null;
    $utm_source  =  isset($_GET['utm_source']) ? htmlspecialchars(stripslashes($_GET['utm_source'])) : null;
    $utm_campaign  =  isset($_GET['utm_campaign']) ? htmlspecialchars(stripslashes($_GET['utm_campaign'])) : null;
    $utm_content  =  isset($_GET['utm_content']) ? htmlspecialchars(stripslashes($_GET['utm_content'])) : null;
    $utm_term  =  isset($_GET['utm_term']) ? htmlspecialchars(stripslashes($_GET['utm_term'])) : null;
    $mediaCode  =  isset($_GET['mediaCode']) ? htmlspecialchars(stripslashes($_GET['mediaCode'])) : null;
    $externalId  =  isset($_GET['externalId']) ? htmlspecialchars(stripslashes($_GET['externalId'])) : null;

    update_cookies_data('give_xpert_utm_medium', $utm_medium);
    update_cookies_data('give_xpert_utm_source', $utm_source);
    update_cookies_data('give_xpert_utm_campaign', $utm_campaign);
    update_cookies_data('give_xpert_utm_content', $utm_content);
    update_cookies_data('give_xpert_utm_term', $utm_term);
    update_cookies_data('give_xpert_mediaCode', $mediaCode);
    update_cookies_data('give_xpert_externalId', $externalId);
    
    function  create_utm_parameter_for_url()
    {
        $utm_keys  = [
            'utm_medium',
            'utm_source',
            'utm_campaign',
            'utm_content',
            'utm_term',
            'mediaCode',
            'externalId'
        ];
        
        $numItems = count($utm_keys);
        $i = 0;
        $query_params = "?"; 
        foreach ($utm_keys as $key => $utm_key) {
            if (isset($_COOKIE["give_xpert_".$utm_key])) {

                if (++$i === $numItems) {
                    $query_params .= $utm_key . "=" . $_COOKIE["give_xpert_".$utm_key];
                } else {
                    $query_params .= $utm_key . "=" . $_COOKIE["give_xpert_".$utm_key] . "&";
                }
            }
        }
        //  in case there is no cookies but utm value is in link    

        if ($query_params =="?") {
           return slim_get_values_concat($_GET);
        }else{

            return $query_params;
        }
    }
}

function slim_get_values_concat($values){
    $output="?";
    if (count($values) > 0){

        foreach ($values as $key => $utm_key) { 
            $output .= $key . "=" . $utm_key . "&";
        } 
    }else{
        $output ="";
    } 
     
    return $output;
}

/**
 * Undocumented function
 *
 * @param [type] $cookie_name
 * @param [type] $new_cookies_name
 * @return void
 * 
 *  todo  :the function isnt working check later why @rogelio  
 */
function  update_cookies_data($cookie_name, $new_cookies_value)
{

    if (!isset($_COOKIE[$cookie_name])) {
        if ($new_cookies_value != "null") {
            setcookie($cookie_name, $new_cookies_value, time() + 1200);
        }
    } else {
        // unset($_COOKIE[$cookie_name]);
        setcookie($cookie_name, $new_cookies_value, time() + 1200);
    }
}

add_action('init', 'give_xpert_cookies_management');
?>