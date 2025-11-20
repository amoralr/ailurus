import { map } from "nanostores";

export interface EditorState {
  isEditing: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  error: string | null;
}

export const editorStore = map<EditorState>({
  isEditing: false,
  isSaving: false,
  hasUnsavedChanges: false,
  lastSaved: null,
  autoSaveEnabled: true,
  error: null,
});

export function setEditing(value: boolean) {
  editorStore.setKey("isEditing", value);
}

export function setSaving(value: boolean) {
  editorStore.setKey("isSaving", value);
}

export function setHasChanges(value: boolean) {
  editorStore.setKey("hasUnsavedChanges", value);
}

export function setLastSaved(date: Date) {
  editorStore.setKey("lastSaved", date);
  editorStore.setKey("hasUnsavedChanges", false);
  editorStore.setKey("error", null);
}

export function setAutoSaveEnabled(value: boolean) {
  editorStore.setKey("autoSaveEnabled", value);
}

export function setError(error: string | null) {
  editorStore.setKey("error", error);
  editorStore.setKey("isSaving", false);
}

export function resetEditor() {
  editorStore.set({
    isEditing: false,
    isSaving: false,
    hasUnsavedChanges: false,
    lastSaved: null,
    autoSaveEnabled: true,
    error: null,
  });
}
