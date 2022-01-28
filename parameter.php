<?php
add_action('admin_menu', 'givexpert_plugin_page');
add_action('init', 'givexpert_session_start');

function givexpert_session_start()
{
	if (!session_id()) {

		@session_start();
	}
}

function givexpert_unset_session_data()
{
	if (isset($_COOKIE[session_name()])) {
		session_unset();   // détruit les variables de session 
		session_destroy();
	}
}

function givexpert_plugin_page()
{
	$page_title = 'Customiser le bouton ';
	$menu_title = 'GiveXpert';
	$capatibily = 'manage_options';
	$slug = 'givexpert-plugin';
	$callback = 'givexpert_button_html';
	$icon = 'dashicons-schedule';
	$position = 60;

	add_menu_page($page_title, $menu_title, "manage_options", $slug, "main_menu");
	add_submenu_page($slug, "Parametre", "Configuration", 'administrator', 'parametre', "parametre_sub_menu_html");
	add_submenu_page($slug, "Shortcode", "Shortcode", 'administrator', 'shortcode', "shortcode_sub_menu_html");
	unset($GLOBALS['submenu'][$slug][0]);
}

// function  menu
function main_menu()
{
	echo 'GiveXpert Plugin';
}


function parametre_sub_menu_html()
{
	wp_enqueue_style('giveXpert-style', plugins_url('css/styles.css', __FILE__));
	wp_enqueue_style('giveXpert-parameter-style', plugins_url('css/parameter.css', __FILE__));
	global $wpdb;
	$table_name = $wpdb->prefix . "client_data";

	$table_name = $wpdb->prefix . "client_data";
	$client_data = $wpdb->get_results("SELECT * FROM `$table_name` ");



	if (isset($_POST['domaine'])) {


		$charset_collate = $wpdb->get_charset_collate();

		$_SESSION['succes_flash']  = "true";

		$wpdb->query("TRUNCATE TABLE `$table_name`");

		$wpdb->insert($table_name, array('identifiant' => $_POST['identifiant'], 'domaine' => $_POST['domaine'], 'password' => $_POST['password']));

		wp_redirect(admin_url('admin.php?page=parametre'));
	}elseif(isset($_POST['submit'])){
		$wpdb->query("TRUNCATE TABLE `$table_name`");
		wp_redirect(admin_url('admin.php?page=parametre'));
	}
	 else {
	?>
		<div class="row">

			<div class="col-md-4 m-5 bg-white p-5">


				<form id="contact" action="" method="post" autocomplete='off'>
					<?php
					if (isset($_SESSION['succes_flash'])) {

						echo "<div  class='alert alert-success'> Parametre mise à jour avec succès </div>";
						session_unset();
						session_destroy();
					}
					?>
					<h3>Paramètre du module GiveXpert</h3> <br>
					<hr>


					<div class="mb-3">
						<input class='form-control' placeholder="URL" name="domaine" type="text" required autofocus>
					</div>

					<div class="mb-3">
						<input class='form-control' placeholder="Identifiant API" name="identifiant" value="" type="identifiant" tabindex="1" autocomplete="off" required>

					</div>
					<div class="mb-3">
						<input class='form-control' placeholder="Mot de passe API" name="password" value="" type="password" tabindex="1" autocomplete="off" required>

					</div>
					<div>
						<button class="btn  btn-lg w-100 btn-success">Enregistrer les modifications</button>
					</div>

				</form>
			</div>

			<!--  information du comptes -->
			<div class="col-md-6 m-5 bg-white p-5">
				<form id="contact" action="" method="post" autocomplete='off'>

					<h3>Informations de connexion</h3> <br>
					<hr>

					<?php
					if (count($client_data) > 0) {
						$user_config_data =  $client_data[0];    ?>

						<div class="mb-3">
							<label class="text-black"><b>statut</b> : <span class="text-success">Activé</span></label>
						</div>

						<div class="mb-3">
							<label class="text-black" for="">Domaine : <?php echo $user_config_data->domaine ?></label>
						</div>
						<div class="mb-3">
							<label class="text-black" for="">Identifiant : <?php echo $user_config_data->identifiant ?></label>
						</div>
						<div class="mb-3">
							<label class="text-black" for="">Mot de passe : ************</label>
						</div>
						
						<div class="mb-3">
							<button name="submit"  value="disconnect" class="btn btn-danger">Deconnecter</button>
						</div>
					<?php
					} else { ?>
						<div class="mb-3">
							<label class="text-black"><b>status</b> : <span class="text-danger">Non Activé</span></label>
						</div>

						<div class="mb-3">
							<label class="text-black" for="">Domaine : <b>A renseigner</b> </label>
						</div>
						<div class="mb-3">
							<label class="text-black" for="">Identifiant : <b>A renseigner</b> </label>
						</div>
						<div class="mb-3">
							<label class="text-black" for="">Mot de passe : <b>A renseigner</b> <label>
						</div>
					<?php
					}
					?>
				</form>
			</div>

		</div>
	<?php
		if (count($client_data) > 0) {
			# code...
		}
	}
}

function shortcode_sub_menu_html()
{
	wp_enqueue_style('giveXpert-style', plugins_url('css/styles.css', __FILE__));
	wp_enqueue_style('giveXpert-parameter-style', plugins_url('css/parameter.css', __FILE__));
	?>
	<div class="row">

		<div class="col-md-11 m-5 row bg-white p-5">
			<div class="col-12">

				<h2 class='text-center'> Notre shortcode</h2>
			</div><br><br>
			<div class="col-md-12">
				<p class="text-google"> <span> [givexpert <b>idformulaire</b>=1 <b>objectifdecollecte</b>=500
						<b>montantdedepart</b>=0 <b>arriereplanbouton</b>=#408080 <b>couleurdutexte</b>=#c0c0c0 <b>affichercompteur</b>=true <b>afficherbouton</b>=true <b>aficherbardeprogression</b>=true]</span></p>

			</div>

			<div class="col-md-12">
				<h5>Details</h5>

				<table class='table table-bordered text-dark'>
    <thead class="thead-dark">
        <tr>
            <th>Clé</th>
            <th>Descirption</th>
            <th>type de valeur</th>
            <th>Valeur par defaut</th>
        </tr>
    </thead>
    <tbody>

        <tr>
            <td><b>idformulaire</b></td>
            <td>Représente l'identifiant du formulaire de don</td>
            <td>numérique</td>
            <td>0</td>
        </tr>
        <tr>
            <td><b>objectifdecollecte</b></td>
            <td>Représente l'objectif de la collecte</td>
            <td>numérique</td>
            <td>0</td>
        </tr>
        <tr>
            <td><b>montantdedepart</b></td>
            <td>Représente le montant  de départ de la collecte </td>
            <td>numérique</td>
            <td>0</td>
        </tr>
        <tr>
            <td><b>arriereplanbouton</b></td>
            <td>
				Représente la couleur d'arriere plan du bouton et la couleur du texte de la barre de progression <br>
					exemple : ##f00020/ red
		</td>
            <td>alpha-numérique</td>
            <td>inherit</td>
        </tr>
        <tr>
            <td><b>couleurdutexte</b></td>
            <td>Représente la couleur du texte du bonton et la couleur d'arrière  plan de la barre de progression  </td>
            <td>alpha-numérique</td>
            <td>inherit</td>
        </tr>
        <tr>
            <td><b>affichercompteur</b></td>
            <td>Afficher/cacher le montant deja collecté </td>
            <td>booléen</td>
            <td>false</td>
        </tr>
        <tr>
            <td><b>afficherbouton</b></td>
            <td>Afficher/cacher le bouton menant au formulaire de don </td>
            <td>alpha-numérique</td>
            <td>Faire un don</td>
        </tr>
        <tr>
            <td><b>aficherbardeprogression</b></td>
            <td>Afficher/cacher la barre de progression des dons </td>
            <td>alpha-numérique</td>
            <td>false</td>
        </tr>
    </tbody>


</table>

			</div>

		</div>

		<div class="col-md-12">
		</div>
	</div>
<?php
}
?>