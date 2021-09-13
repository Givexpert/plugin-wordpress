<?php
/**
 * Plugin Name: GiveXpert
 * Author: GiveXpert
 * Description: Connectez le module de don et d'inscription GiveXpert à votre site Wordpress en toute simplicité.
 * Version: 1.0.1
 */

require_once(dirname(__FILE__) . '/parameter.php');
require_once(dirname(__FILE__) . '/sql-table.php');
require_once(dirname(__FILE__) . '/functions.php');
require_once(dirname(__FILE__) . '/shortcode.php');
require_once(dirname(__FILE__) . '/cookies-management.php');


register_activation_hook(__FILE__, 'create_client_data_table');
register_uninstall_hook(__FILE__, 'delete_plugin_database_table');


global $jal_db_version;
$jal_db_version = '1.0';
// Load assets for wp-admin when editor is active
function gutenberg_givexpert_block_admin()
{

    wp_enqueue_script('jquery');
    wp_enqueue_script(
        'give-xpert-block',
        plugins_url('block.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-color-picker', 'jquery')
    );

    wp_localize_script("give-xpert-block", 'GiveXpertBlockParams', [
        "logo_link" =>  plugins_url('images/logo_GiveXpert.png', __FILE__),
        // 'user_templates_data'=> [] ,
        'user_templates_data' => get_user_template_datas(),
        'utm_values' => create_utm_parameter_for_url(),
        'ajaxurl'   => admin_url('admin-ajax.php'),
    ]);


    wp_enqueue_style(
        'give-xpert-block',
        plugins_url('css/styles.css', __FILE__),
        array()
    );

    // wp_enqueue_script(
    //     'give-xpert-block-js ',
    //     plugins_url('js/custom.js', __FILE__),
    //     array('jquery')
    // );
    wp_enqueue_script(
        'give-xpersst-block-js ',
        plugins_url('js/block-additional.js', __FILE__),
        array('jquery')
    );
}

add_action('enqueue_block_editor_assets', 'gutenberg_givexpert_block_admin');

add_action('wp_ajax_ajax_progress_bar_save_code', 'ajax_progress_bar_save_code');

add_action('wp_ajax_ajax_save_progress_bar_data', 'ajax_save_progress_bar_data');
// Load assets for frontend
function  gutenberg_givexpert_block_frontend()
{

    // wp_enqueue_style(
    //    'give-xpert-block',
    //    plugins_url( 'css/block.css', __FILE__ ),
    //    array()
    // );
    wp_enqueue_script(
        'give-xpert-block-js',
        plugins_url('js/custom.js', __FILE__),
        array('jquery',)
    );

    wp_enqueue_style(
        'give-xpert-block',
        plugins_url('css/styles.css', __FILE__),
        array()
    );
    wp_localize_script("give-xpert-block-js", 'GiveXpertBlockParams', [
        'utm_values' => create_utm_parameter_for_url(),
        "progressbar_values" => get_progressbar_datas()
    ]);
}
add_action('wp_enqueue_scripts', 'gutenberg_givexpert_block_frontend');



// usefull function 

function get_user_template_datas()
{

    global $wpdb;
    $table_name = $wpdb->prefix . "client_data";
    $client_data = $wpdb->get_results("SELECT * FROM `$table_name` ");


    $client_data =  $client_data[0];
    if ($client_data->domaine && $client_data->identifiant && $client_data->password) {

        $baseURL =  formatBaseApiUrl($client_data->domaine);

        $url = $baseURL . "api/templates/" . "?user=" . $client_data->identifiant . "&key=" . $client_data->password;

        $body_response    = CallAPI('GET', 'https://jsonplaceholder.typicode.com/todos/1');
       // var_dump($url); die;
        return $body_response->templates;
    }


    $body_response  =  new stdClass;
    $body_response->url = '#';
    $body_response->name = 'Vueillez configurer votre compte';
    return [$body_response];
}

//  get progressbar data info  
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
    $body_response->name = 'Vueillez configurer votre compte';
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

//todo  : add to ajax secgtion   
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
        
    }elseif( count($new_exist_data) > 0){
        
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
?>