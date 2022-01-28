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
//register_uninstall_hook(__FILE__, 'delete_plugin_database_table');

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
        'user_templates_data' => get_user_template_datas(),
        'utm_values' => create_utm_parameter_for_url(),
        'ajaxurl'   => admin_url('admin-ajax.php'),
    ]);

    wp_enqueue_style(
        'give-xpert-block',
        plugins_url('css/styles.css', __FILE__),
        array()
    );

    wp_enqueue_script(
        'give-xpersst-block-js ',
        plugins_url('js/block-additional.js', __FILE__),
        array('jquery')
    );
}

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

add_action('enqueue_block_editor_assets', 'gutenberg_givexpert_block_admin');

add_action('wp_ajax_ajax_progress_bar_save_code', 'ajax_progress_bar_save_code');

add_action('wp_ajax_ajax_save_progress_bar_data', 'ajax_save_progress_bar_data');

add_action('wp_enqueue_scripts', 'gutenberg_givexpert_block_frontend');

?>