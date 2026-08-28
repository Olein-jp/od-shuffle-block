const { expect, test } = require( '@wordpress/e2e-test-utils-playwright' );

const INITIAL_CONTENT = `<!-- wp:od/shuffle -->
<!-- wp:od/shuffle-item -->
<!-- wp:paragraph -->
<p>Candidate Alpha</p>
<!-- /wp:paragraph -->
<!-- /wp:od/shuffle-item -->
<!-- /wp:od/shuffle -->`;

test.describe( 'OD Shuffle editor', () => {
	let postId;

	test.beforeEach( async ( { admin, requestUtils } ) => {
		const post = await requestUtils.createPost( {
			title: 'OD Shuffle E2E',
			content: INITIAL_CONTENT,
			status: 'draft',
			date_gmt: '2020-01-01T00:00:00',
		} );

		postId = post.id;
		await admin.editPost( postId );
	} );

	test.afterEach( async ( { requestUtils } ) => {
		if ( ! postId ) {
			return;
		}

		await requestUtils.rest( {
			method: 'DELETE',
			path: `/wp/v2/posts/${ postId }`,
			params: { force: true },
		} );
	} );

	test( 'keeps candidate navigation and selection in sync', async ( {
		editor,
		page,
	} ) => {
		const parent = editor.canvas.locator( '[data-type="od/shuffle"]' );
		const items = editor.canvas.locator( '[data-type="od/shuffle-item"]' );

		await expect( parent ).toHaveCount( 1 );
		await expect( items ).toHaveCount( 1 );
		await expect( items.nth( 0 ) ).toBeVisible();

		for ( let index = 0; index < 2; index++ ) {
			await editor.selectBlocks( parent );
			await page.getByRole( 'button', { name: 'Add candidate' } ).click();
		}

		await expect( items ).toHaveCount( 3 );
		await expect( items.nth( 0 ) ).toBeHidden();
		await expect( items.nth( 1 ) ).toBeHidden();
		await expect( items.nth( 2 ) ).toBeVisible();

		await editor.selectBlocks( parent );
		await page.getByRole( 'button', { name: '3 / 3' } ).click();
		await page.getByRole( 'menuitem', { name: 'Candidate 2' } ).click();

		await expect( items.nth( 1 ) ).toBeVisible();
		await expect( items.nth( 1 ) ).toHaveClass( /is-selected/ );

		await page.getByRole( 'button', { name: 'Next candidate' } ).click();
		await expect( items.nth( 2 ) ).toBeVisible();
		await expect( items.nth( 2 ) ).toHaveClass( /is-selected/ );
		await expect(
			page.getByRole( 'button', { name: 'Next candidate' } )
		).toBeDisabled();

		await page
			.getByRole( 'button', { name: 'Previous candidate' } )
			.click();
		await page
			.getByRole( 'button', { name: 'Previous candidate' } )
			.click();
		await expect( items.nth( 0 ) ).toBeVisible();
		await expect( items.nth( 0 ) ).toHaveClass( /is-selected/ );
		await expect(
			page.getByRole( 'button', { name: 'Previous candidate' } )
		).toBeDisabled();

		await page.getByRole( 'button', { name: 'Document Overview' } ).click();
		const listViewItems = page
			.getByRole( 'tabpanel', { name: 'List View' } )
			.getByText( 'Shuffle Item', { exact: true } );
		await expect( listViewItems ).toHaveCount( 3 );
		await listViewItems.nth( 1 ).click();
		await expect( items.nth( 1 ) ).toBeVisible();
		await expect( items.nth( 1 ) ).toHaveClass( /is-selected/ );

		await editor.saveDraft();
		await page.reload();

		await expect(
			page.getByText( 'Block contains unexpected or invalid content.' )
		).toHaveCount( 0 );
		await expect( items ).toHaveCount( 3 );
		await expect( items.nth( 0 ) ).toBeVisible();
		await expect( items.nth( 1 ) ).toBeHidden();
		await expect( items.nth( 2 ) ).toBeHidden();
	} );
} );
