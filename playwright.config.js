const path = require( 'path' );

const baseURL = process.env.WP_BASE_URL || 'http://localhost:8888';
const storageState = path.join(
	__dirname,
	'artifacts/storage-states/admin.json'
);

process.env.WP_BASE_URL = baseURL;
process.env.STORAGE_STATE_PATH = storageState;

const { defineConfig } = require( '@playwright/test' );

module.exports = defineConfig( {
	testDir: './tests/e2e',
	fullyParallel: false,
	workers: 1,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	globalSetup: require.resolve( './tests/e2e/global-setup' ),
	use: {
		baseURL,
		storageState,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
} );
