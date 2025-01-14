// routes/render.ts
import { z } from "zod";
import katex from "katex";
import type { TrustContext } from "katex";

const TrustContextSchema: z.ZodSchema<TrustContext> = z.custom<TrustContext>();

// Define a schema for the structure of a macro object
const MacroObjectSchema = z.object({
  definition: z.string(),
  numArgs: z.number().optional(),
  // Add other potential properties of a macro object if needed
});

// Define the schema for KatexOptions using Zod
const KatexOptionsSchema = z.object({
  displayMode: z.boolean().optional(),
  output: z.enum(["html", "mathml", "htmlAndMathml"]).optional(),
  leqno: z.boolean().optional(),
  fleqn: z.boolean().optional(),
  throwOnError: z.boolean().optional(),
  errorColor: z.string().optional(),
  macros: z
    .record(z.union([z.string(), MacroObjectSchema, z.function()]))
    .optional(),
  minRuleThickness: z.number().optional(),
  colorIsTextColor: z.boolean().optional(),
  maxSize: z.number().optional(),
  maxExpand: z.number().optional(),
  strict: z.union([
    z.boolean(),
    z.literal("ignore"),
    z.literal("warn"),
    z.literal("error"),
  ]).optional(),
  trust: z.union([
    z.boolean(),
    z.function().args(TrustContextSchema).returns(z.boolean()),
  ]).optional(),
  globalGroup: z.boolean().optional(),
});

// Define the schema for the request body
const RenderLatexSchema = z.object({
  latex: z.string().min(1, "LaTeX string cannot be empty"),
  options: KatexOptionsSchema.optional(),
});

// Handler for the /render endpoint
export const renderLatexHandler = async (req: Request): Promise<Response> => {
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

  const parseResult = RenderLatexSchema.safeParse(body);
  if (!parseResult.success) {
    return new Response(
      JSON.stringify({ error: "Invalid input", details: parseResult.error.errors }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { latex, options } = parseResult.data;

  let html: string;
  try {
    html = katex.renderToString(latex, options);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to render LaTeX" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({ html }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
