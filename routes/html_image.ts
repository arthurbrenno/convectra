// routes/html_to_image.ts
import * as htmlToImage from 'html-to-image';
import { z } from "zod";
import { JSDOM } from 'jsdom'; // Import JSDOM for server-side DOM manipulation

// Define the schema for the request body
const HtmlToImageSchema = z.object({
  html: z.string().min(1, "HTML string cannot be empty"),
  options: z
    .object({
      width: z.number().optional(),
      height: z.number().optional(),
      style: z.any().optional(), // Allows any CSS style object
      backgroundColor: z.string().optional(),
      canvasWidth: z.number().optional(),
      canvasHeight: z.number().optional(),
      quality: z.number().min(0).max(1).optional(), // For JPEG/WebP
      pixelRatio: z.number().optional(),
      foreignObjectRendering: z.enum(['auto', 'user']).optional(),
      imagePlaceholder: z.string().optional(),
      mimeType: z.enum(['image/png', 'image/jpeg', 'image/webp']).optional(), // mimeType is part of options
    })
    .optional(),
  download: z.boolean().optional().default(false), // Flag to trigger download
  filename: z.string().optional(), // Filename for download
});

// Handler for the /html-to-image endpoint
export const htmlToImageHandler = async (req: Request): Promise<Response> => {
  let body: unknown;
  try {
    body = await req.json();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const parseResult = HtmlToImageSchema.safeParse(body);
  if (!parseResult.success) {
    return new Response(
      JSON.stringify({ error: "Invalid input", details: parseResult.error.errors }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { html, options, download, filename } = parseResult.data;
  const mimeType = options?.mimeType || 'image/png'; // Default if not provided

  try {
    const dom = new JSDOM(html); // Create a virtual DOM
    const document = dom.window.document;

    // You might want to append the HTML to the body or a specific element
    // depending on how you want to render it.
    document.body.innerHTML = html;

    const dataUrl = await htmlToImage.toBlob(document.body, { // Target the body of the virtual DOM
      ...options,
    });

    if (!dataUrl) {
      return new Response(
        JSON.stringify({ error: "Failed to convert HTML to image" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const arrayBuffer = await dataUrl.arrayBuffer();
    const headers: HeadersInit = { 'Content-Type': mimeType };

    if (download) {
      const suggestedFilename = filename || 'image';
      headers['Content-Disposition'] = `attachment; filename="${suggestedFilename}.${mimeType.split('/')[1]}"`;
    }

    return new Response(
      arrayBuffer,
      {
        status: 200,
        headers: headers,
      }
    );

  } catch (error) {
    console.error("Error converting HTML to image:", error);
    return new Response(
      JSON.stringify({ error: "Failed to convert HTML to image" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};