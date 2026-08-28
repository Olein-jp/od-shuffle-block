<?php
/**
 * Bootstraps WordPress integration tests.
 *
 * @package OD_Shuffle_Block
 */

$od_shuffle_block_tests_dir = getenv( 'WP_TESTS_DIR' );
$od_shuffle_block_root      = dirname( __DIR__, 2 );

if ( ! $od_shuffle_block_tests_dir ) {
	// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fwrite -- CLI-only bootstrap failure.
	fwrite( STDERR, "WP_TESTS_DIR is not set. Run the suite through wp-env tests-cli.\n" );
	exit( 1 );
}

require_once $od_shuffle_block_root . '/vendor/autoload.php';

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- Required by WordPress tests.
define(
	'WP_TESTS_PHPUNIT_POLYFILLS_PATH',
	$od_shuffle_block_root . '/vendor/yoast/phpunit-polyfills'
);
// phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound

require_once $od_shuffle_block_tests_dir . '/includes/functions.php';

tests_add_filter(
	'muplugins_loaded',
	static function () use ( $od_shuffle_block_root ) {
		require $od_shuffle_block_root . '/od-shuffle-block.php';
	}
);

require $od_shuffle_block_tests_dir . '/includes/bootstrap.php';
