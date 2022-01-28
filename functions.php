<?php

function get_user_template_datas()
{
    global $wpdb;
    $table_name = $wpdb->prefix . "client_data";
    $client_data = $wpdb->get_results("SELECT * FROM `$table_name` ");

    $client_data =  $client_data[0];
    if ($client_data->domaine && $client_data->identifiant && $client_data->password) {

        $baseURL =  formatBaseApiUrl($client_data->domaine);

        $url = $baseURL . "api/templates" . "?user=" . $client_data->identifiant . "&key=" . $client_data->password;

        $output = file_get_contents($url);
        
        $output_json = json_decode($output, true);

        $template_array = [];
        for ($i=0; $i < count($output_json['templates']) ; $i++) { 
            $template = $output_json['templates'][$i];
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

        return $template_array;
    }

    $body_response  =  new stdClass;
    $body_response->url = '#';
    $body_response->name = 'Veuillez configurer votre compte';
    return [$body_response];
}

function get_progressbar_datas()
{
    global $wpdb;

    $array_data= [];
    $table_name = $wpdb->prefix . "client_data";
    $progressbar_table_name = $wpdb->prefix . "progressbar_data";
    $client_data = $wpdb->get_results("SELECT * FROM `$table_name` ");
    $saved_progress_data = $wpdb->get_results("SELECT * FROM `$progressbar_table_name` ");

    $client_data =  $client_data[0];
    // $saved_progress_data =  $saved_progress_data[0];

    $percentage =  0;
    $collected  =  0;
    $objectif  =  0;
    if ($client_data->domaine && $client_data->identifiant && $client_data->password) {
       
        $baseURL =  formatBaseApiUrl($client_data->domaine);

        $url = $baseURL . "api/templates/" . "?user=" . $client_data->identifiant . "&key=" . $client_data->password;

        $body_response    = CallAPI('GET', $url);
        $templates =  $body_response->templates;
        $i=0;
        foreach ($saved_progress_data as $key_data => $database_value_block) {
 
            foreach ($templates as $key => $template) {

                $collected  = (int)$template->collected;
                $objectif  = $database_value_block->objectifDeCollecte;

                if ($template->id  ==  $database_value_block->idFormulaire) {
                  
                    if( $database_value_block->objectifDeCollecte !== 0){
                        
                        //calcul du pourcentage d'achevement 
                        $percentage  =  ((int)$collected  + $database_value_block->montantDepart) * 100 /  $database_value_block->objectifDeCollecte;
                        $array_data[$i]['percentage']= (int)$percentage;
                        $array_data[$i]['collected']= (int)$collected;
                        $array_data[$i]['objectif']= (int)$objectif;
                        $array_data[$i]['codeBlock']= (int)$database_value_block->codeBlock;
                    }else{
                      
                        $array_data[$i]['percentage']= (int)$percentage;
                        $array_data[$i]['collected']= (int)$collected;
                        $array_data[$i]['objectif']= (int)$objectif;
                        $array_data[$i]['codeBlock']= (int)$database_value_block->codeBlock;
                    }
                    $i++;
                }
            }
        } 

        return $array_data;
    }

    $body_response  =  new stdClass;
    $body_response->url = '#';
    $body_response->name = 'Veuillez configurer votre compte';
    return [$body_response];
}

function CallAPI($method, $url, $data = false)
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

    var_dump($result); die;

    curl_close($curl);

    $decoded_data  =  json_decode($result);

    return $decoded_data;
}

function jal_install()
{
    global $wpdb;
    global $jal_db_version;

    $table_name = $wpdb->prefix . 'client_data';
    $progressbar_table_name = $wpdb->prefix . "progressbar_data";

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE  IF NOT EXISTS  $table_name (
		id int NOT NULL AUTO_INCREMENT, 
		idF varchar(100) DEFAULT '' NOT NULL,
		identifiant varchar(100) DEFAULT '' NOT NULL,
		password varchar(100) DEFAULT '' NOT NULL,
		PRIMARY KEY  (id)
    ) $charset_collate;";

    $sql2 = "CREATE TABLE  IF NOT EXISTS  $progressbar_table_name (
		id int NOT NULL AUTO_INCREMENT, 
        idFormulaire INT(11) NULL DEFAULT NULL,
	    objectifDeCollecte INT(11) NULL DEFAULT NULL,
	    montantDepart INT(11) NULL DEFAULT NULL,
		PRIMARY KEY  (id)
	) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
    dbDelta($sql2);

    $pregoressbar_data = $wpdb->get_results("SELECT * FROM `$progressbar_table_name` ");

    if (count($pregoressbar_data) <= 0) {
        $wpdb->insert($progressbar_table_name, array('id' => 1, 'idFormulaire' => 0, 'objectifDeCollecte' => 0, 'montantDepart' => 0));
    }

    add_option('jal_db_version', $jal_db_version);
}

function ajax_progress_bar_save_code()
{ 
    global $wpdb;
    unset($_POST['action']);

    $uniqid= uniqid();
    $old_code =  $_POST['oldCode'];
    $code_block =  $_POST['codeBlock']; 

    $progressbar_table_name = $wpdb->prefix . "progressbar_data";
    $exist_data = $wpdb->get_results("SELECT * FROM `$progressbar_table_name` where codeBlock =  '$old_code'  ");
    $new_exist_data = $wpdb->get_results("SELECT * FROM `$progressbar_table_name` where codeBlock =  '$code_block'  ");

    if (count($exist_data) == 0 && count($new_exist_data) == 0 ) {
        
        $wpdb->insert($progressbar_table_name, array('idFormulaire' => 0, 'objectifDeCollecte' => 0, 'montantDepart' => 0, "codeBlock" => $code_block));
        $response['codeBlock'] =  $code_block;
    } elseif(count($exist_data) > 0 ) {
        
        unset($_POST['action']);
        unset($_POST['oldCode']);
        $where = ['codeBlock' => $old_code];
        $wpdb->update($wpdb->prefix . 'progressbar_data', $_POST, $where);
        $response['codeBlock'] =  $code_block;
        
    } elseif( count($new_exist_data) > 0){
        
        $wpdb->insert($progressbar_table_name, array('idFormulaire' => 0, 'objectifDeCollecte' => 0, 'montantDepart' => 0, "codeBlock" =>$uniqid.'-'.$code_block));
        
        $response['codeBlock'] =  $uniqid.'-'.$code_block;

    }
 
    $response['success'] = 1; 
    wp_send_json_success( $response );
}

function ajax_save_progress_bar_data()
{
    global $wpdb;

    $code_block =  $_POST['codeBlock'];

    unset($_POST['action']);
    unset($_POST['codeBlock']);
    $data = [];

    foreach ($_POST as $key => $val) {
        $data[$key] =  $val;
    }

    // $data = ['idFormulaire' => '16'];
    $where = ['codeBlock' => $code_block];
    $wpdb->update($wpdb->prefix . 'progressbar_data', $_POST, $where);

    return  null;
}

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