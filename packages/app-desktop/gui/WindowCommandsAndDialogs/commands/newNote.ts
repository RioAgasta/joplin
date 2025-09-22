import { utils, CommandRuntime, CommandDeclaration, CommandContext } from '@joplin/lib/services/CommandService';
import { _ } from '@joplin/lib/locale';
import Setting from '@joplin/lib/models/Setting';
import Note from '@joplin/lib/models/Note';
import Folder from '@joplin/lib/models/Folder';
import Tag from '@joplin/lib/models/Tag';
import Logger from '@joplin/utils/Logger';

const logger = Logger.create('newNoteCommand');

export const newNoteEnabledConditions = 'oneFolderSelected && !inConflictFolder && !folderIsReadOnly && !folderIsTrash';

export const declaration: CommandDeclaration = {
	name: 'newNote',
	label: () => _('New note'),
	iconName: 'fa-file',
};

// Get the currently selected tag ID if in tag view
function getSelectedTagId(context: CommandContext): string | null {
	const state = context.state;
	if (state && state.notesParentType === 'Tag' && state.selectedTagId) {
		return state.selectedTagId;
	}
	return null;
}

export const runtime = (): CommandRuntime => {
	return {
		execute: async (context: CommandContext, body = '', isTodo = false) => {
			const currentFolderId = Setting.value('activeFolderId');

			// Use the existing method from Folder class - no duplication!
			const validFolderId = await Folder.getValidFolderForNewNote(currentFolderId);

			if (!validFolderId) {
				logger.warn('Cannot create new note - no valid folder available.');
				return;
			}

			const defaultValues = Note.previewFieldsWithDefaultValues({ includeTimestamps: false });

			let newNote = {
				...defaultValues,
				parent_id: validFolderId,
				is_todo: isTodo ? 1 : 0,
				body: body,
			};

			newNote = await Note.save(newNote, { provisional: true });

			// If we're in tag view, apply the selected tag to the new note
			const selectedTagId = getSelectedTagId(context);
			if (selectedTagId) {
				try {
					await Tag.addNote(selectedTagId, newNote.id);
					logger.info(`Applied tag ${selectedTagId} to new note ${newNote.id}`);
				} catch (error) {
					logger.error('Failed to apply tag to new note:', error);
				}
			}

			void Note.updateGeolocation(newNote.id);

			utils.store.dispatch({
				type: 'NOTE_SELECT',
				id: newNote.id,
			});

			// Immediately sort the note list so that the new note is positioned correctly before
			// scrolling to it.
			utils.store.dispatch({
				type: 'NOTE_SORT',
			});

			logger.info(`Created note ${newNote.id} in folder ${validFolderId}`);
		},
		enabledCondition: newNoteEnabledConditions,
	};
};
