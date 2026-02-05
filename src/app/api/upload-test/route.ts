/* eslint-disable no-undef */
import { type NextRequest, NextResponse } from "next/server";
import {
  uploadFile,
  deleteFile,
  getFileMetadata,
  isBlobConfigured,
  generateUniqueFilename,
} from "~/lib/storage/blob";

/**
 * Test route for Vercel Blob file upload
 *
 * POST /api/upload-test - Upload a file
 * DELETE /api/upload-test - Delete a file by URL
 * GET /api/upload-test - Check blob configuration status
 *
 * This route should only be used in development/staging environments.
 */

/**
 * GET - Check if blob storage is configured
 */
export async function GET() {
  const configured = isBlobConfigured();

  return NextResponse.json({
    configured,
    message: configured
      ? "Vercel Blob storage is configured and ready"
      : "BLOB_READ_WRITE_TOKEN is not configured",
  });
}

/**
 * POST - Upload a file to blob storage
 *
 * Body: FormData with 'file' field
 * Optional query param: ?folder=documents
 */
export async function POST(request: NextRequest) {
  if (!isBlobConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "BLOB_READ_WRITE_TOKEN is not configured",
      },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No file provided. Send a file with the 'file' field name.",
        },
        { status: 400 }
      );
    }

    // Get optional folder from query params
    const folder = request.nextUrl.searchParams.get("folder") ?? "test-uploads";

    // Generate unique filename
    const filename = generateUniqueFilename(file.name, folder);

    // Upload to Vercel Blob
    const result = await uploadFile(filename, file, {
      access: "public",
      contentType: file.type || undefined,
    });

    return NextResponse.json({
      success: true,
      blob: {
        url: result.url,
        pathname: result.pathname,
        contentType: result.contentType,
        contentDisposition: result.contentDisposition,
      },
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete a file from blob storage
 *
 * Body: { url: string }
 */
export async function DELETE(request: NextRequest) {
  if (!isBlobConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "BLOB_READ_WRITE_TOKEN is not configured",
      },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as { url?: string };
    const url = body.url;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "No URL provided. Send { url: 'blob-url-here' }",
        },
        { status: 400 }
      );
    }

    // Verify the file exists before deleting
    try {
      await getFileMetadata(url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "File not found",
        },
        { status: 404 }
      );
    }

    await deleteFile(url);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
      deletedUrl: url,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Delete failed",
      },
      { status: 500 }
    );
  }
}
