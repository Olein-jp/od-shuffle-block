import { createReduxStore, register } from '@wordpress/data';

const DEFAULT_STATE = {};

const actions = {
	setActiveItem( parentClientId, itemClientId ) {
		return {
			type: 'SET_ACTIVE_ITEM',
			parentClientId,
			itemClientId,
		};
	},
};

function reducer( state = DEFAULT_STATE, action ) {
	if ( 'SET_ACTIVE_ITEM' !== action.type ) {
		return state;
	}

	return {
		...state,
		[ action.parentClientId ]: action.itemClientId,
	};
}

const selectors = {
	getActiveItem( state, parentClientId ) {
		return state[ parentClientId ] ?? null;
	},
};

export const store = createReduxStore( 'od-shuffle-block/editor', {
	reducer,
	actions,
	selectors,
} );

register( store );
