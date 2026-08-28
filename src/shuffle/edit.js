import {
	BlockControls,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Dropdown,
	MenuGroup,
	MenuItem,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import { store as shuffleEditorStore } from './editor-store';

const ALLOWED_BLOCKS = [ 'od/shuffle-item' ];
const TEMPLATE = [ [ 'od/shuffle-item' ] ];

export default function Edit( { clientId } ) {
	const { insertBlock, selectBlock } = useDispatch( blockEditorStore );
	const { setActiveItem } = useDispatch( shuffleEditorStore );

	const { activeClientId, childClientIds, selectedCandidateId } = useSelect(
		( select ) => {
			const blockEditor = select( blockEditorStore );
			const itemIds = blockEditor.getBlockOrder( clientId );
			const selectedClientId = blockEditor.getSelectedBlockClientId();
			const selectedParents = selectedClientId
				? blockEditor.getBlockParents( selectedClientId )
				: [];
			const candidateId = itemIds.find(
				( itemId ) =>
					itemId === selectedClientId ||
					selectedParents.includes( itemId )
			);

			return {
				activeClientId:
					select( shuffleEditorStore ).getActiveItem( clientId ),
				childClientIds: itemIds,
				selectedCandidateId: candidateId ?? null,
			};
		},
		[ clientId ]
	);

	useEffect( () => {
		if ( selectedCandidateId && selectedCandidateId !== activeClientId ) {
			setActiveItem( clientId, selectedCandidateId );
		}
	}, [ activeClientId, clientId, selectedCandidateId, setActiveItem ] );

	useEffect( () => {
		if (
			childClientIds.length > 0 &&
			! childClientIds.includes( activeClientId )
		) {
			setActiveItem( clientId, childClientIds[ 0 ] );
		}
	}, [ activeClientId, childClientIds, clientId, setActiveItem ] );

	const currentClientId = childClientIds.includes( activeClientId )
		? activeClientId
		: childClientIds[ 0 ] ?? null;
	const activeIndex = Math.max(
		0,
		childClientIds.indexOf( currentClientId )
	);

	const switchCandidate = ( itemClientId ) => {
		setActiveItem( clientId, itemClientId );
		selectBlock( itemClientId );
	};

	const addCandidate = () => {
		const newItem = createBlock( 'od/shuffle-item' );
		insertBlock( newItem, childClientIds.length, clientId );
		setActiveItem( clientId, newItem.clientId );
		selectBlock( newItem.clientId );
	};

	const blockProps = useBlockProps( {
		className: 'od-shuffle-editor',
		'data-label': sprintf(
			/* translators: 1: Current candidate number, 2: Total candidates. */
			__( 'OD Shuffle — Candidate %1$d of %2$d', 'od-shuffle-block' ),
			childClientIds.length ? activeIndex + 1 : 0,
			childClientIds.length
		),
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		renderAppender: false,
		template: TEMPLATE,
		templateLock: false,
	} );

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<Dropdown
						popoverProps={ { placement: 'bottom-start' } }
						renderToggle={ ( { isOpen, onToggle } ) => (
							<ToolbarButton
								aria-expanded={ isOpen }
								aria-haspopup="menu"
								disabled={ 0 === childClientIds.length }
								onClick={ onToggle }
							>
								{ sprintf(
									/* translators: 1: Current candidate number, 2: Total candidates. */
									__( '%1$d / %2$d', 'od-shuffle-block' ),
									childClientIds.length ? activeIndex + 1 : 0,
									childClientIds.length
								) }
							</ToolbarButton>
						) }
						renderContent={ ( { onClose } ) => (
							<MenuGroup
								label={ __(
									'Display candidate',
									'od-shuffle-block'
								) }
							>
								{ childClientIds.map(
									( itemClientId, index ) => (
										<MenuItem
											key={ itemClientId }
											icon={
												itemClientId === currentClientId
													? 'yes'
													: undefined
											}
											onClick={ () => {
												switchCandidate( itemClientId );
												onClose();
											} }
										>
											{ sprintf(
												/* translators: %d: Candidate number. */
												__(
													'Candidate %d',
													'od-shuffle-block'
												),
												index + 1
											) }
										</MenuItem>
									)
								) }
							</MenuGroup>
						) }
					/>
					<ToolbarButton
						icon="plus"
						label={ __( 'Add candidate', 'od-shuffle-block' ) }
						onClick={ addCandidate }
					/>
				</ToolbarGroup>
			</BlockControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
