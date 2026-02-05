/* eslint-disable no-undef */
import {
  put,
  del,
  list,
  head,
  type PutBlobResult,
  type HeadBlobResult,
  type ListBlobResult,
} from "@vercel/blob";

/**
 * Vercel Blob Storage Utilities
 *
 * Helper functions for file upload, download, and management.
 * Uses BLOB_READ_WRITE_TOKEN from environment variables.
 *
 * @see https://vercel.com/docs/storage/vercel-blob
 */

/**
 * Check if blob storage is configured
 * Useful for conditional logic in development
 */
export function isBlobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/**
 * Upload a file to Vercel Blob storage
 *
 * @param filename - The name for the stored file
 * @param data - The file data (File, Blob, ArrayBuffer, or string)
 * @param options - Additional options (access, contentType, etc.)
 * @returns The blob result with URL and metadata
 *
 * @example
 * ```ts
 * const result = await uploadFile('documents/report.pdf', file, {
 *   access: 'public',
 *   contentType: 'application/pdf',
 * });
 * console.log(result.url); // https://blob.vercel-storage.com/...
 * ```
 */
export async function uploadFile(
  filename: string,
  data: File | Blob | ArrayBuffer | string,
  options?: {
    access?: "public";
    contentType?: string;
    addRandomSuffix?: boolean;
    cacheControlMaxAge?: number;
  }
): Promise<PutBlobResult> {
  if (!isBlobConfigured()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN environment variable is not configured"
    );
  }

  return put(filename, data, {
    access: options?.access ?? "public",
    contentType: options?.contentType,
    addRandomSuffix: options?.addRandomSuffix ?? true,
    cacheControlMaxAge: options?.cacheControlMaxAge,
  });
}

/**
 * Delete a file from Vercel Blob storage
 *
 * @param url - The blob URL to delete
 *
 * @example
 * ```ts
 * await deleteFile('https://blob.vercel-storage.com/...');
 * ```
 */
export async function deleteFile(url: string): Promise<void> {
  if (!isBlobConfigured()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN environment variable is not configured"
    );
  }

  await del(url);
}

/**
 * Delete multiple files from Vercel Blob storage
 *
 * @param urls - Array of blob URLs to delete
 */
export async function deleteFiles(urls: string[]): Promise<void> {
  if (!isBlobConfigured()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN environment variable is not configured"
    );
  }

  await del(urls);
}

/**
 * Get metadata for a blob file
 *
 * @param url - The blob URL
 * @returns Blob metadata (size, contentType, etc.)
 */
export async function getFileMetadata(url: string): Promise<HeadBlobResult> {
  if (!isBlobConfigured()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN environment variable is not configured"
    );
  }

  return head(url);
}

/**
 * List files in blob storage
 *
 * @param options - List options (prefix, limit, cursor)
 * @returns List of blobs with pagination
 *
 * @example
 * ```ts
 * const { blobs, cursor } = await listFiles({
 *   prefix: 'documents/',
 *   limit: 100,
 * });
 * ```
 */
export async function listFiles(options?: {
  prefix?: string;
  limit?: number;
  cursor?: string;
}): Promise<ListBlobResult> {
  if (!isBlobConfigured()) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN environment variable is not configured"
    );
  }

  return list({
    prefix: options?.prefix,
    limit: options?.limit,
    cursor: options?.cursor,
  });
}

/**
 * Generate a unique filename with timestamp
 *
 * @param originalName - Original filename
 * @param prefix - Optional folder prefix
 * @returns Unique filename with path
 *
 * @example
 * ```ts
 * generateUniqueFilename('report.pdf', 'documents');
 * // Returns: 'documents/1706745600000-report.pdf'
 * ```
 */
export function generateUniqueFilename(
  originalName: string,
  prefix?: string
): string {
  const timestamp = Date.now();
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filename = `${timestamp}-${safeName}`;

  return prefix ? `${prefix}/${filename}` : filename;
}

// Re-export types for convenience
export type { PutBlobResult, HeadBlobResult, ListBlobResult };
