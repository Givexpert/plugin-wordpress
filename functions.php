<?php

function check_url($url) {
    $last_char = substr($url, -1); 

    if($last_char == '/'){
        return $url;
    } else {
        return $url.'/';
    }
}

function get_api_data() {
    $api_content_file = __DIR__ . '/api_content.txt';
    $api_content_date_file = __DIR__ . '/api_content_date.txt';
    $current_date = date('Y-m-d H:i:s');

    global $wpdb;
    $table_name = $wpdb->prefix . "client_data";
    $client_data = $wpdb->get_results("SELECT * FROM `$table_name` ");

    $client_data =  $client_data[0];
    if ($client_data->domaine && $client_data->identifiant && $client_data->password) {
        $url = check_url($client_data->domaine) . "?user=" . $client_data->identifiant . "&key=" . $client_data->password . "&display=Y";

        if(isset($api_content_file) && filesize($api_content_file) == 0) {
            $args = array(
                'Content-Type' => 'application/json'
            );
            $get_data = wp_remote_get($url, $args);
            $api_content_data = $get_data['body'];

            $fp = fopen($api_content_file, 'w'); 
            fwrite($fp, $api_content_data);
            fclose($fp);

            $fp = fopen($api_content_date_file, 'w'); 
            fwrite($fp, $current_date);
            fclose($fp);
        } else {
            if(filesize($api_content_date_file) > 0) {
                $api_content_date = file_get_contents($api_content_date_file);
                $current_date_times = strtotime($current_date);
                $api_content_date_times = strtotime($api_content_date);

                $nb_minutes_elapsed = round(abs($current_date_times - $api_content_date_times) / 60);

                if($nb_minutes_elapsed > 5) {
                    $args = array(
                        'Content-Type' => 'application/json'
                    );
                    $get_data = wp_remote_get($url, $args);
                    $api_content_data = $get_data['body'];

                    $fp = fopen($api_content_file, 'w'); 
                    fwrite($fp, $api_content_data);
                    fclose($fp);

                    $fp = fopen($api_content_date_file, 'w'); 
                    fwrite($fp, $current_date);
                    fclose($fp);
                } else {
                    $api_content_data = file_get_contents($api_content_file);
                }
            } else {
                $api_content_data = file_get_contents($api_content_file);
            }
        }

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

        return $template_array;
    }
}

function get_user_template_datas() {
    return get_api_data();
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

    $template_array = get_api_data();

    if(count($template_array) > 0) {
        $i=0;
        foreach ($saved_progress_data as $key_data => $database_value_block) {
 
            foreach ($template_array as $key => $template) {

                $collected  = (int)$template->collected;
                $objectif  = $database_value_block->objectifDeCollecte;
                $percentage = 0;

                if ($template->id  ==  $database_value_block->idFormulaire) {
                  
                    if( $database_value_block->objectifDeCollecte !== 0){
                        
                        //calcul du pourcentage d'achevement 
                        $percentage  = ($database_value_block->objectifDeCollecte > 0) ? ($collected  + $database_value_block->montantDepart) * 100 /  $database_value_block->objectifDeCollecte : 0;
                        $array_data[$i]['percentage']= (int)$percentage;
                        $array_data[$i]['collected']= (int)$collected;
                        $array_data[$i]['objectif']= (int)$objectif;
                        $array_data[$i]['codeBlock']= (int)$database_value_block->codeBlock;
                    } else {
                      
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

function get_progressbar_datas_olddd()
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

        $url = check_url($client_data->domaine). "?user=" . $client_data->identifiant . "&key=" . $client_data->password;

        try {
            $output = file_get_contents($url);
        } catch (\Throwable $th) {
            //throw $th;
        }
        
        $output_json = json_decode($output, true);
        $template_array = [];

        if(isset($output_json)) {
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
        }


        $i=0;
        foreach ($saved_progress_data as $key_data => $database_value_block) {
 
            foreach ($template_array as $key => $template) {

                $collected  = (int)$template->collected;
                $objectif  = $database_value_block->objectifDeCollecte;
                $percentage = 0;

                if ($template->id  ==  $database_value_block->idFormulaire) {
                  
                    if( $database_value_block->objectifDeCollecte !== 0){
                        
                        //calcul du pourcentage d'achevement 
                        $percentage  = ($database_value_block->objectifDeCollecte > 0) ? ($collected  + $database_value_block->montantDepart) * 100 /  $database_value_block->objectifDeCollecte : 0;
                        $array_data[$i]['percentage']= (int)$percentage;
                        $array_data[$i]['collected']= (int)$collected;
                        $array_data[$i]['objectif']= (int)$objectif;
                        $array_data[$i]['codeBlock']= (int)$database_value_block->codeBlock;
                    } else {
                      
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