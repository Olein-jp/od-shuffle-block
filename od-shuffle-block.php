<?php
/**
 * Plugin Name:       OD Shuffle Block
 * Plugin URI:        https://github.com/Olein-jp/od-shuffle-block
 * Description:       Provides the foundation for the OD Shuffle Block plugin.
 * Version:           0.1.0
 * Requires at least: 5.9
 * Requires PHP:      7.4
 * Author:            Koji Kuno
 * Author URI:        https://olein-design.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       od-shuffle-block
 * Domain Path:       /languages
 * Update URI:        https://github.com/Olein-jp/od-shuffle-block
 *
 * @package OD_Shuffle_Block
 */

defined( 'ABSPATH' ) || exit;

define( 'OD_SHUFFLE_BLOCK_VERSION', '0.1.0' );
define( 'OD_SHUFFLE_BLOCK_FILE', __FILE__ );

add_action(
	'init',
	static function () {
		load_plugin_textdomain(
			'od-shuffle-block',
			false,
			dirname( plugin_basename( OD_SHUFFLE_BLOCK_FILE ) ) . '/languages'
		);
	}
);

$od_shuffle_block_autoloader = __DIR__ . '/vendor/autoload.php';

if ( ! is_readable( $od_shuffle_block_autoloader ) ) {
	add_action(
		'admin_notices',
		static function () {
			if ( ! current_user_can( 'activate_plugins' ) ) {
				return;
			}

			printf(
				'<div class="notice notice-error"><p>%s</p></div>',
				esc_html__( 'OD Shuffle Block could not start because its dependencies are missing. Install the plugin from a release package.', 'od-shuffle-block' )
			);
		}
	);

	return;
}

require_once $od_shuffle_block_autoloader;

add_action(
	'plugins_loaded',
	static function () {
		new Inc2734\WP_GitHub_Plugin_Updater\Bootstrap(
			plugin_basename( OD_SHUFFLE_BLOCK_FILE ),
			'Olein-jp',
			'od-shuffle-block',
			array(
				'requires'     => '5.9',
				'requires_php' => '7.4',
			)
		);
	}
);
