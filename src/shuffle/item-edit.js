import {
	BlockControls,
	InnerBlocks,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

import { store as shuffleEditorStore } from './editor-store';

export default function ItemEdit( { clientId } ) {
	const { selectBlock } = useDispatch( blockEditorStore );
	const { setActiveItem } = useDispatch( shuffleEditorStore );
	const { activeClientId, index, itemClientIds, parentClientId } = useSelect(
		( select ) => {
			const blockEditor = select( blockEditorStore );
			const rootClientId = blockEditor.getBlockRootClientId( clientId );
			const siblingClientIds = blockEditor.getBlockOrder( rootClientId );

			return {
				activeClientId:
					select( shuffleEditorStore ).getActiveItem( rootClientId ),
				index: siblingClientIds.indexOf( clientId ),
				itemClientIds: siblingClientIds,
				parentClientId: rootClientId,
			};
		},
		[ clientId ]
	);
	const isActive =
		activeClientId === clientId || ( ! activeClientId && 0 === index );

	const blockProps = useBlockProps( {
		className: `od-shuffle-item-editor ${
			isActive ? 'is-active' : 'is-inactive'
		}`,
		'data-label': sprintf(
			/* translators: %d: Candidate number. */
			__( 'Candidate %d', 'od-shuffle-block' ),
			index + 1
		),
		'data-parent-client-id': parentClientId,
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		renderAppender: InnerBlocks.ButtonBlockAppender,
	} );

	const moveToCandidate = ( targetIndex ) => {
		const targetClientId = itemClientIds[ targetIndex ];

		if ( ! targetClientId ) {
			return;
		}

		setActiveItem( parentClientId, targetClientId );
		selectBlock( targetClientId );
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						disabled={ index <= 0 }
						icon="arrow-left-alt2"
						label={ __( 'Previous candidate', 'od-shuffle-block' ) }
						onClick={ () => moveToCandidate( index - 1 ) }
					/>
					<ToolbarButton
						disabled={ index >= itemClientIds.length - 1 }
						icon="arrow-right-alt2"
						label={ __( 'Next candidate', 'od-shuffle-block' ) }
						onClick={ () => moveToCandidate( index + 1 ) }
					/>
				</ToolbarGroup>
			</BlockControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
