-- CreateTable: FTS5 virtual table for full-text search on documents
CREATE VIRTUAL TABLE documents_fts USING fts5(
  document_id UNINDEXED,
  title,
  content,
  excerpt,
  category_id UNINDEXED,
  path UNINDEXED,
  tokenize = 'unicode61 remove_diacritics 2'
);

-- Populate FTS5 table with existing documents
INSERT INTO documents_fts (document_id, title, content, excerpt, category_id, path)
SELECT id, title, content, COALESCE(excerpt, ''), categoryId, path
FROM documents
WHERE status = 'PUBLISHED';

-- Trigger: Insert new documents into FTS5
CREATE TRIGGER documents_fts_insert AFTER INSERT ON documents
WHEN NEW.status = 'PUBLISHED'
BEGIN
  INSERT INTO documents_fts (document_id, title, content, excerpt, category_id, path)
  VALUES (NEW.id, NEW.title, NEW.content, COALESCE(NEW.excerpt, ''), NEW.categoryId, NEW.path);
END;

-- Trigger: Update documents in FTS5
CREATE TRIGGER documents_fts_update AFTER UPDATE ON documents
WHEN NEW.status = 'PUBLISHED'
BEGIN
  DELETE FROM documents_fts WHERE document_id = OLD.id;
  INSERT INTO documents_fts (document_id, title, content, excerpt, category_id, path)
  VALUES (NEW.id, NEW.title, NEW.content, COALESCE(NEW.excerpt, ''), NEW.categoryId, NEW.path);
END;

-- Trigger: Delete documents from FTS5 when archived or deleted
CREATE TRIGGER documents_fts_delete AFTER UPDATE ON documents
WHEN NEW.status IN ('ARCHIVED', 'DRAFT') AND OLD.status = 'PUBLISHED'
BEGIN
  DELETE FROM documents_fts WHERE document_id = OLD.id;
END;

-- Trigger: Delete from FTS5 on document deletion
CREATE TRIGGER documents_fts_hard_delete AFTER DELETE ON documents
BEGIN
  DELETE FROM documents_fts WHERE document_id = OLD.id;
END;