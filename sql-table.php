<?php
/**
 * create client domaine data  info function
 *
 * @return void
 */
function create_client_data_table() {
	global $wpdb;
	global $jal_db_version;
		
	$table_name = $wpdb->prefix . 'client_data';
	$progressbar_table_name = $wpdb->prefix . "progressbar_data";

	
	$charset_collate = $wpdb->get_charset_collate();

	$sql = "CREATE TABLE  IF NOT EXISTS  $table_name (
		id int NOT NULL AUTO_INCREMENT, 
		domaine varchar(100) DEFAULT '' NOT NULL,
		identifiant varchar(100) DEFAULT '' NOT NULL,
		password varchar(100) DEFAULT '' NOT NULL,
		PRIMARY KEY  (id)
	) $charset_collate;";

		$sql2 = "CREATE TABLE  IF NOT EXISTS  $progressbar_table_name (
			id int NOT NULL AUTO_INCREMENT, 
			idFormulaire INT(11) NULL DEFAULT NULL,
			objectifDeCollecte INT(11) NULL DEFAULT NULL,
			montantDepart INT(11) NULL DEFAULT NULL,
			codeBlock varchar(100) DEFAULT '' NOT NULL,
			PRIMARY KEY  (id),
			UNIQUE INDEX `codeBlock` (`codeBlock`)
		) $charset_collate;";

	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sql );
	dbDelta($sql2);
	 
	// $wpdb->insert($progressbar_table_name, array('idFormulaire' => 0, 'objectifDeCollecte' => 0, 'montantDepart' => 0));
	
	// just for test   to remove befor prod
	// $wpdb->insert($table_name, array('domaine' => 'https://2021-1.givexpert.org/', 'identifiant' => 'wanoon', 'password' => '6e1aa1b2b2afa7b8'));

	add_option( 'jal_db_version', $jal_db_version );
}


/**
 * Undocumented function
 *
 * @return void
 */
function delete_plugin_database_table(){
    global $wpdb;
    global $jal_db_version;
	
    
    $table_name = $wpdb->prefix . 'client_data';
	$progressbar_table_name = $wpdb->prefix . "progressbar_data";
    $sql = "DROP TABLE IF EXISTS $table_name";
    $sql2 = "DROP TABLE IF EXISTS $progressbar_table_name";
    $wpdb->query($sql);
    $wpdb->query($sql2);
     
    delete_option( 'jal_db_version', $jal_db_version );
}
?>