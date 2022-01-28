<?php
/**
 * Plugin Name: Very First Plugin
 * Plugin URI: https://www.yourwebsiteurl.com/
 * Description: This is the very first plugin I ever created.
 * Version: 1.0
 * Author: Your Name Here
 * Author URI: http://yourwebsiteurl.com/
 **/

function capitaine_shortcode_first_name($atts)
{
    // wp_enqueue_style('text-style', plugins_url('css/styles.css', __FILE__)); 

    global $wpdb;

    $uniqueCode =  uniqid().'-'.rand();
    
    $codeBlock          =  isset($atts['codedublock']) ? $atts['codedublock'] : $uniqueCode;

    $objectiveCollection   =  isset($atts['objectifdecollecte']) ? $atts['objectifdecollecte'] : 0;
    $startingAmount        =  isset($atts['montantdedepart']) ? $atts['montantdedepart'] : 0;
    $idFormulaire          =  isset($atts['idformulaire']) ? $atts['idformulaire'] : 1;
    $ArrierePlanBouton          =  isset($atts['arriereplanbouton']) ? $atts['arriereplanbouton'] : "inherit";
    $textColor          =  isset($atts['couleurdutexte']) ? $atts['couleurdutexte'] : "inherit";

    $showMeter          =  isset($atts['affichercompteur']) ? filter_var($atts['affichercompteur'], FILTER_VALIDATE_BOOLEAN) : false;
    $showButton          =  isset($atts['afficherbouton']) ? filter_var($atts['afficherbouton'], FILTER_VALIDATE_BOOLEAN) : false;
    $showProgress          =  isset($atts['aficherbardeprogression']) ? filter_var($atts['aficherbardeprogression'], FILTER_VALIDATE_BOOLEAN) : false;

    $table_name = $wpdb->prefix . "client_data";
    $client_data = $wpdb->get_results("SELECT * FROM `$table_name` ");


    $client_data =  $client_data[0];
    if ($client_data->domaine && $client_data->identifiant && $client_data->password) {

        $baseURL =  formatBaseApiUrl($client_data->domaine);

        $url = $baseURL . "api/templates/" . "?user=" . $client_data->identifiant . "&key=" . $client_data->password . "&id=" . $idFormulaire;

        $template    = getTemplateById('GET', $url);

        $collected  = $template->collected;
        $percentage  =   0;

        $percentage =  ($startingAmount  + (int)$collected) * 100 /    $objectiveCollection;

        $percentage = (int)$percentage;

        //insertion en  base

        $data = [
            'idFormulaire' => $idFormulaire,
            'objectifDeCollecte' =>  $objectiveCollection,
            'montantDepart' =>  $startingAmount,
            "codeBlock" =>$codeBlock 
        ];

        // $where = ['id' => 1];
        // $wpdb->update($wpdb->prefix . 'progressbar_data', $data, $where);
        $wpdb->insert($wpdb->prefix . 'progressbar_data', $data);

        $formBegin  =  "
                <div class='container-fluid' style='font-size : 25px'>
                    <div class='row'> 
                        <div class='col-md-12'>";
 
        $formEnd = "
                        </div>
                    </div> 
                </div>";

        $formContent = "";

        //meter is on  
        if ($showMeter) {
            $formContent  .= "
                <div class=''>
                    <h4>$collected € collectés</h4>
                </div>
           ";
        }

        //meter is on  
        if ($showProgress) {
            $formContent  .= "
            <div class='progress ' style='height: 30px;background-color :$textColor'>
            <div class='progress-bar' role='progressbar' style='font-size: 25px;width: $percentage%;background-color :$ArrierePlanBouton' aria-valuenow='$percentage' aria-valuemin='0' aria-valuemax='100'>$percentage%</div>
                </div>
                <div class=''>
                    <span>sur  $objectiveCollection € d'objectifs</span>
                </div>
            </div>
           ";
        }
        //button is on  
        if ($showButton) {
            $formContent  .= "
            <div class='col-md-12'>
                <button type=' button' 
                    class=' btn-lg p-4 redirectButton' 
                    datatext='#' 
                    style='background-color:$ArrierePlanBouton;color:$textColor;font-family:inherit'>

                    Faire un don
                </button>
            </div>
           ";
        }

        return  $formBegin . $formContent . $formEnd;

        $formulaire   = "
                <div class='container-fluid' style='font-size : 25px'>
                    <div class='row'> 
                        <div class='col-md-12'>
                            <div class=''>
                                <h1>$collected € collectés</h1>
                            </div>
                            <div class='progress ' style='height: 30px;background-color :$textColor'>
                                <div class='progress-bar' role='progressbar' style='font-size: 25px;width: $percentage%;background-color :$ArrierePlanBouton' aria-valuenow='$percentage' aria-valuemin='0' aria-valuemax='100'>$percentage%</div>
                            </div>
                            <div class=''>
                                <span>sur  $objectiveCollection € d'objectifs</span>
                            </div>
                        </div>
                       
                        <div class='col-md-12'>
                        <button type=' button' 
                            class=' btn-lg p-4 redirectButton' 
                            datatext='#' 
                            style='background-color:$ArrierePlanBouton;color:$textColor;font-family:inherit'>

                            Faire un don
                        </button>
   
                        </div>
                    </div> 
                </div>
        ";
        // return  $formulaire;
    } else {
        $formulaire   = "
    
            <div class='container-fluid' style='font-size : 30px'>
                <div class='row'> 
                    <div class='col-md-12'>
                        <div class=''>
                            <h1>Vueillez configurer votre compte</h1>
                        </div>
                        
                    </div>
                </div> 
            </div>
        ";
        return  $formulaire;
    }
}

add_shortcode('givexpert', 'capitaine_shortcode_first_name');

function getTemplateById($method, $url, $data = false)
{
    // $url  ="https://jsonplaceholder.typicode.com/posts";
    $curl = curl_init();
    switch ($method) {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);

            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    // Optional Authentication:
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($curl, CURLOPT_USERPWD, "username:password");

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);

    curl_close($curl);
    $decoded_data  =  json_decode($result);

    $template  =   $decoded_data->templates;
    $template =  $template[0];

    return $template;
}
?>