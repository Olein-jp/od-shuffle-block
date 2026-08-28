import { dispatch, select } from '@wordpress/data';

import { store } from '../editor-store';

describe( 'shuffle editor store', () => {
	it( 'keeps the active candidate separate for each parent block', () => {
		dispatch( store ).setActiveItem( 'parent-a', 'item-a-2' );
		dispatch( store ).setActiveItem( 'parent-b', 'item-b-1' );

		expect( select( store ).getActiveItem( 'parent-a' ) ).toBe(
			'item-a-2'
		);
		expect( select( store ).getActiveItem( 'parent-b' ) ).toBe(
			'item-b-1'
		);
	} );
} );
