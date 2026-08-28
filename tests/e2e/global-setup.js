const path = require( 'path' );

const { RequestUtils } = require( '@wordpress/e2e-test-utils-playwright' );

module.exports = async ( config ) => {
	const baseURL = config.projects[ 0 ].use.baseURL;
	const storageStatePath = path.resolve(
		__dirname,
		'../../artifacts/storage-states/admin.json'
	);
	const requestUtils = await RequestUtils.setup( {
		baseURL,
		storageStatePath,
	} );

	await requestUtils.setupRest();
	await requestUtils.request.dispose();
};
