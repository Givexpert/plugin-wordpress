<?php

function givexpert_check_url($url) {
    $last_char = substr($url, -1); 

    if($last_char == '/'){
        return $url;
    } else {
        return $url.'/';
    }
}

function givexpert_write_in_files($url, $contentFile, $lastDateFile) {
    $current_date = date('Y-m-d H:i:s');

    $args = array(
        'Content-Type' => 'application/json'
    );
    $get_data = wp_remote_get($url, $args);
    $api_data = $get_data['body'];

    try {
        $fp = fopen($contentFile, 'w'); 
        fwrite($fp, $api_data);
        fclose($fp);

        $fp = fopen($lastDateFile, 'w'); 
        fwrite($fp, $current_date);
        fclose($fp);
    } catch (\Throwable $th) {
        //throw $th;
    }

    return $api_data;
}

function givexpert_format_templates_data($data) {
    $result = [];
    for ($i=0; $i < count($data) ; $i++) { 
        $template = $data[$i];
        $object = new stdClass();
        $object->id = $template['id'];
        $object->name = $template['name'];
        $object->url = $template['url'];
        $object->collected = $template['collected'];
        $object->number_donors = $template['number_donors'];
        $object->type = $template['type'];
        $object->display = $template['display'];
        $object->lang = $template['lang'];
        $object->code = $template['code'];
        $object->organisation_id = $template['organisation_id'];

        $result[] = $object;
    }

    return $result;
}

function givexpert_format_template_collectors_data($data) {
    $result = [];
    for ($i=0; $i < count($data) ; $i++) { 
        $template = $data[$i];
        $object = new stdClass();
        $object->id = $template['id'];
        $object->name = $template['name'];
        $object->url = $template['url'];
        $object->collected = $template['collected'];
        $object->number_donors = $template['number_donors'];
        $object->type = $template['type'];
        $object->display = $template['display'];
        $object->lang = $template['lang'];
        $object->code = $template['code'];
        $object->title = $template['title'];
        $object->firstname = $template['firstname'];
        $object->lastname = $template['lastname'];
        $object->email = $template['email'];
        $object->goal = $template['goal'];
        $object->date_start = $template['date_start'];
        $object->date_stop = $template['date_stop'];
        $object->photo = $template['photo'];
        $date_stop = strtotime($template['date_stop']);
        $current_date = strtotime(date('Y-m-d'));
        $object->remaining_day = ($current_date < $date_stop) ? round(abs($current_date - $date_stop) / (60 * 60 * 24)) : 0;

        $result[] = $object;
    }

    return $result;
}

function givexpert_get_connexion_data() {
    global $wpdb;
    $table_name = $wpdb->prefix . "client_data";
    $client_data = $wpdb->get_results("SELECT * FROM `$table_name` ");

    $client_data =  $client_data[0];
    if ($client_data->domaine && $client_data->identifiant && $client_data->password) {
        $domaine = base64_decode($client_data->domaine);
        $identifiant = base64_decode($client_data->identifiant);
        $password = base64_decode($client_data->password);

        return [
            'domaine' => givexpert_check_url($domaine),
            'user' => $identifiant,
            'key' => $password,
        ];
    }
}

function givexpert_get_api_data($route) {
    $api_templates_content = __DIR__ . '/api_templates_content.txt';
    $api_templates_last_date = __DIR__ . '/api_templates_last_date.txt';
    $api_template_collectors_content = __DIR__ . '/api_template_collectors_content.txt';
    $api_template_collectors_last_date = __DIR__ . '/api_template_collectors_last_date.txt';
    $current_date = date('Y-m-d H:i:s');

    global $wpdb;
    $table_name = $wpdb->prefix . "client_data";
    $client_data = $wpdb->get_results("SELECT * FROM `$table_name` ");

    $client_data =  $client_data[0];
    if ($client_data->domaine && $client_data->identifiant && $client_data->password) {
        $domaine = base64_decode($client_data->domaine);
        $identifiant = base64_decode($client_data->identifiant);
        $password = base64_decode($client_data->password);

        $url = givexpert_check_url($domaine) . $route . "/?user=" . $identifiant . "&key=" . $password . "&display=Y";

        $current_date_times = strtotime($current_date);
        $api_content = ($route == 'templates') ? $api_templates_content : $api_template_collectors_content;
        $api_last_date = ($route == 'templates') ? $api_templates_last_date : $api_template_collectors_last_date;

        if(isset($api_content) && filesize($api_content) == 0) {
            $api_data = givexpert_write_in_files($url, $api_content, $api_last_date);
        } else {
            if(filesize($api_last_date) > 0) {
                $last_date = strtotime(file_get_contents($api_last_date));
                $nb_minutes_elapsed = round(abs($current_date_times - $last_date) / 60);

                if($nb_minutes_elapsed > 5) {
                    $api_data = givexpert_write_in_files($url, $api_content, $api_last_date);
                } else {
                    $api_data = file_get_contents($api_content);
                }
            } else {
                $api_data = file_get_contents($api_content);
            }
        }

        $data_json = (isset($api_data)) ? json_decode($api_data, true) : [];
            
        if(!isset($data_json['templates'])) {
            return [];
        }

        return ($route == 'templates') ? givexpert_format_templates_data($data_json['templates']) : givexpert_format_template_collectors_data($data_json['templates']);
    }
}

function givexpert_get_template_collectors_datas() {
    return givexpert_get_api_data('template_collectors');
}

function givexpert_get_template_peer_datas() {
    $data = givexpert_get_api_data('templates');
    $result = [];

    for ($i=0; $i < count($data) ; $i++) { 
        $template = $data[$i];
        if($template->type == "TemplatePeer") {
            $result[] = $template;
        }
    }

    return $result;
}

function givexpert_get_template_datas() {
    return givexpert_get_api_data('templates');
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

    $percentage =  0;
    $collected  =  0;
    $objectif  =  0;

    $template_array = givexpert_get_api_data('templates');

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

function givexpert_ajax_progress_bar_save_code()
{ 
    global $wpdb;
    unset($_POST['action']);

    $uniqid= uniqid();

    $old_code =  isset($_POST['oldCode']) ? sanitize_text_field($_POST['oldCode']) : 0;

    $code_block =  isset($_POST['codeBlock']) ? sanitize_text_field($_POST['codeBlock']) : 0;

    $progressbar_table_name = $wpdb->prefix . "progressbar_data";
    $exist_data =  $wpdb->get_results( $wpdb->prepare( "SELECT * FROM `$progressbar_table_name` WHERE codeBlock = %s", $old_code ) );
    $new_exist_data =  $wpdb->get_results( $wpdb->prepare( "SELECT * FROM `$progressbar_table_name` WHERE codeBlock = %s", $code_block ) );

    if (count($exist_data) == 0 && count($new_exist_data) == 0 ) {
        
        $wpdb->insert($progressbar_table_name, array('idFormulaire' => 0, 'objectifDeCollecte' => 0, 'montantDepart' => 0, "codeBlock" => $code_block));
        $response['codeBlock'] =  $code_block;
    } elseif (count($exist_data) > 0 ) {

        $where = ['codeBlock' => $old_code];

        $data = [];
        foreach ($_POST as $key => $val) {
            $data[$key] =  sanitize_text_field($val);
        }

        $wpdb->update($wpdb->prefix . 'progressbar_data', $data, $where);
        $response['codeBlock'] =  $code_block;
        
    } elseif ( count($new_exist_data) > 0){
        
        $wpdb->insert($progressbar_table_name, array('idFormulaire' => 0, 'objectifDeCollecte' => 0, 'montantDepart' => 0, "codeBlock" => $uniqid.'-'.$code_block));
        
        $response['codeBlock'] =  $uniqid.'-'.$code_block;

    }
 
    $response['success'] = 1; 
    wp_send_json_success( $response );
}

function givexpert_ajax_save_progress_bar_data()
{
    global $wpdb;

    $code_block = isset($_POST['codeBlock']) ? sanitize_text_field($_POST['codeBlock']) : -1;

    unset($_POST['action']);
    unset($_POST['codeBlock']);
    $data = [];

    foreach ($_POST as $key => $val) {
        $data[$key] =  sanitize_text_field($val);
    }

    $where = ['codeBlock' => $code_block];
    $wpdb->update($wpdb->prefix . 'progressbar_data', $data, $where);

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