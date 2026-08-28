import { registerBlockType } from '@wordpress/blocks';

import itemMetadata from '../shuffle-item/block.json';
import metadata from './block.json';
import Edit from './edit';
import './editor.scss';
import ItemEdit from './item-edit';
import itemSave from './item-save';
import save from './save';

registerBlockType( metadata.name, {
	...metadata,
	edit: Edit,
	save,
} );

registerBlockType( itemMetadata.name, {
	...itemMetadata,
	edit: ItemEdit,
	save: itemSave,
} );
