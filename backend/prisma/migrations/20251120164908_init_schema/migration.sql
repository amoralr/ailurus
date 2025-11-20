-- CreateTable
CREATE TABLE "documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "categoryId" TEXT NOT NULL,
    "subcategory" TEXT,
    "path" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL DEFAULT 'anonymous',
    CONSTRAINT "documents_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "folders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "icon" TEXT,
    "path" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "parentId" INTEGER,
    CONSTRAINT "folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folders" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "folder_documents" (
    "folderId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("folderId", "documentId"),
    CONSTRAINT "folder_documents_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "folder_documents_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "folder_categories" (
    "folderId" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("folderId", "categoryId"),
    CONSTRAINT "folder_categories_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "folder_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "changes" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "category_stats" (
    "categoryId" TEXT NOT NULL PRIMARY KEY,
    "totalDocuments" INTEGER NOT NULL DEFAULT 0,
    "publishedDocs" INTEGER NOT NULL DEFAULT 0,
    "draftDocs" INTEGER NOT NULL DEFAULT 0,
    "archivedDocs" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_slug_key" ON "documents"("slug");

-- CreateIndex
CREATE INDEX "idx_document_category" ON "documents"("categoryId");

-- CreateIndex
CREATE INDEX "idx_document_status" ON "documents"("status");

-- CreateIndex
CREATE INDEX "idx_document_path" ON "documents"("path");

-- CreateIndex
CREATE INDEX "idx_document_created" ON "documents"("createdAt");

-- CreateIndex
CREATE INDEX "idx_category_order" ON "categories"("order");

-- CreateIndex
CREATE UNIQUE INDEX "folders_path_key" ON "folders"("path");

-- CreateIndex
CREATE INDEX "idx_folder_parent" ON "folders"("parentId");

-- CreateIndex
CREATE INDEX "idx_folder_path" ON "folders"("path");

-- CreateIndex
CREATE INDEX "idx_folder_type" ON "folders"("type");

-- CreateIndex
CREATE INDEX "idx_folder_order" ON "folders"("order");

-- CreateIndex
CREATE INDEX "idx_folder_document_folder" ON "folder_documents"("folderId");

-- CreateIndex
CREATE INDEX "idx_folder_document_document" ON "folder_documents"("documentId");

-- CreateIndex
CREATE INDEX "idx_folder_category_folder" ON "folder_categories"("folderId");

-- CreateIndex
CREATE INDEX "idx_folder_category_category" ON "folder_categories"("categoryId");

-- CreateIndex
CREATE INDEX "idx_activity_entity" ON "activity_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "idx_activity_user" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX "idx_activity_created" ON "activity_logs"("createdAt");
