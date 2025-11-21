// Tipos compartidos que coinciden con el backend

export enum DocumentStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

export interface Document {
    id: number;
    slug: string;
    title: string;
    content: string;
    excerpt: string | null;
    categoryId: string;
    subcategory: string | null;
    path: string;
    status: DocumentStatus;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface CreateDocumentDto {
    title: string;
    content: string;
    excerpt?: string;
    categoryId: string;
    subcategory?: string;
    path: string;
    status?: DocumentStatus;
    createdBy?: string;
}

export interface UpdateDocumentDto {
    title?: string;
    content?: string;
    excerpt?: string;
    categoryId?: string;
    subcategory?: string;
    path?: string;
}
