import { StateUpdates, State, HelperFunctions } from '../types';
import { set } from 'lodash';

export function applyChanges(updates: StateUpdates, state: State, helperFn: HelperFunctions) {
	const { hasChanged } = helperFn;

	if (hasChanged('localType')) {
		removeSchema(updates);
		setTypeToAlias(updates);
		setSpecialToFieldRef(updates);
	}
}

export function removeSchema(updates: StateUpdates) {
	set(updates, 'field.schema', undefined);
}

export function setTypeToAlias(updates: StateUpdates) {
	set(updates, 'field.type', 'alias');
}

export function setSpecialToFieldRef(updates: StateUpdates) {
	set(updates, 'field.meta.special', ['alias', 'fieldref']);
}
