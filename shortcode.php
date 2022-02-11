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

        $last_char = substr($client_data->domaine, -1); 
        $domaine = $client_data->domaine;

        if($last_char == '/'){
            $domaine = $client_data->domaine;
        } else {
            $domaine = $client_data->domaine.'/';
        }
        $url = $domaine. "?user=" . $client_data->identifiant . "&key=" . $client_data->password . "&id=" . $idFormulaire . "&display=Y";

        $template = get_template_by_id($url);

        $collected = (isset($template->collected)) ? $template->collected : 0;
        $percentage = 0;

        $percentage = (($startingAmount + (int)$collected) * 100) / $objectiveCollection;

        $percentage = (int)$percentage;

        $data = [
            'idFormulaire' => $idFormulaire,
            'objectifDeCollecte' =>  $objectiveCollection,
            'montantDepart' =>  $startingAmount,
            "codeBlock" =>$codeBlock 
        ];

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

        if ($showMeter) {
            $formContent  .= "
                <div class=''>
                    <span style='font-size: 18px'>$collected € collectés</span>
                </div>
           ";
        }

        if ($showProgress) {
            $formContent  .= "
            <div class='progress ' style='height: 30px;background-color :$textColor'>
            <div class='progress-bar' role='progressbar' style='font-size: 20px;width: $percentage%;background-color :$ArrierePlanBouton' aria-valuenow='$percentage' aria-valuemin='0' aria-valuemax='100'>$percentage%</div>
                </div>
                <div class=''>
                    <span style='font-size: 18px'>sur  $objectiveCollection € d'objectifs</span>
                </div>
            </div>
           ";
        }

        if ($showButton) {
            $formContent  .= "
            <div class='col-md-12' style='margin-top: 10px;'>
                <button type='button' 
                    class=' btn-lg redirectButton' 
                    datatext='#' 
                    style='background-color:$ArrierePlanBouton;color:$textColor;font-family:inherit;font-size:16px'>
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
                                <span style='font-size: 16px'>$collected € collectés</span>
                            </div>
                            <div class='progress ' style='height: 30px;background-color :$textColor'>
                                <div class='progress-bar' role='progressbar' style='font-size: 25px;width: $percentage%;background-color :$ArrierePlanBouton' aria-valuenow='$percentage' aria-valuemin='0' aria-valuemax='100'>$percentage%</div>
                            </div>
                            <div class=''>
                                <span style='font-size: 16px'>sur  $objectiveCollection € d'objectifs</span>
                            </div>
                        </div>
                       
                        <div class='col-md-12'>
                        <button type='button' 
                            class=' btn-lg redirectButton' 
                            datatext='#' 
                            style='background-color:$ArrierePlanBouton;color:$textColor;font-family:inherit;font-size:16px'>
                            Faire un don
                        </button>
   
                        </div>
                    </div> 
                </div>
        ";
    } else {
        $formulaire   = "
    
            <div class='container-fluid' style='font-size : 25px'>
                <div class='row'> 
                    <div class='col-md-12'>
                        <div class=''>
                            <h1>Veuillez configurer votre compte</h1>
                        </div>
                        
                    </div>
                </div> 
            </div>
        ";
        return  $formulaire;
    }
}

add_shortcode('givexpert', 'capitaine_shortcode_first_name');

function get_template_by_id($url) {
    $args = array(
        'Content-Type' => 'application/json'
    );
    $get_data = wp_remote_get($url, $args);
    $api_content_data = $get_data['body'];

    $data_json = (isset($api_content_data)) ? json_decode($api_content_data, true) : [];
        
    $template_array = [];
    if(!isset($data_json['templates'])) {
        return [];
    }

    for ($i=0; $i < count($data_json['templates']) ; $i++) { 
        $template = $data_json['templates'][$i];
        $template_object = new stdClass();
        $template_object->id = $template['id'];
        $template_object->name = $template['name'];
        $template_object->url = $template['url'];
        $template_object->collected = $template['collected'];
        $template_object->number_donors = $template['number_donors'];
        $template_object->type = $template['type'];
        $template_object->display = $template['display'];
        $template_object->lang = $template['lang'];
        $template_object->code = $template['code'];
        $template_object->organisation_id = $template['organisation_id'];

        $template_array[] = $template_object;
    }

    return (count($template_array) > 0) ? $template_array[0] : $template_array;
}
?>