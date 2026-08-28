<?php
/**
 * Plugin Name:       OD Shuffle Block
 * Plugin URI:        https://github.com/Olein-jp/od-shuffle-block
 * Description:       Randomly displays one of several block combinations.
 * Version:           0.2.0
 * Requires at least: 6.6
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

define( 'OD_SHUFFLE_BLOCK_VERSION', '0.2.0' );
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

/**
 * Registers the plugin blocks from their metadata.
 *
 * @return void
 */
function od_shuffle_block_register_blocks() {
	register_block_type_from_metadata( __DIR__ . '/build/shuffle' );
	register_block_type_from_metadata( __DIR__ . '/build/shuffle-item' );
}
add_action( 'init', 'od_shuffle_block_register_blocks' );

add_action(
	'plugins_loaded',
	static function () {
		new Inc2734\WP_GitHub_Plugin_Updater\Bootstrap(
			plugin_basename( OD_SHUFFLE_BLOCK_FILE ),
			'Olein-jp',
			'od-shuffle-block',
			array(
				'requires'     => '6.6',
				'requires_php' => '7.4',
			)
		);
	}
);
