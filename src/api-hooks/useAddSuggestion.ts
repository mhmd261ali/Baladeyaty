// netlify/functions/suggestions.ts
import type {
  Handler,
  HandlerEvent,
  HandlerResponse,
} from "@netlify/functions";
import { client } from "../lib/sanityClient";

// Reusable CORS headers (strings only)
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Helpers to ensure consistent HandlerResponse shape
function json(statusCode: number, data: unknown): HandlerResponse {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}

function text(statusCode: number, message: string): HandlerResponse {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/plain",
    },
    body: message,
  };
}

export const handler: Handler = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  // Preflight
  if (event.httpMethod === "OPTIONS") {
    // 204 with empty body is valid; still return headers as strings
    return {
      statusCode: 204,
      headers: { ...corsHeaders },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return text(405, "Method Not Allowed");
  }

  try {
    const body = JSON.parse(event.body || "{}");

    // Minimal validation
    const required = [
      "suggestion",
      "suggestion_category",
      "suggestion_description",
      "suggestion_person_name",
      "suggestion_person_nbr",
      "suggestion_person_email",
    ] as const;

    for (const k of required) {
      if (!body[k]) {
        return json(400, { error: `Missing field: ${k}` });
      }
    }

    const today = new Date().toISOString().slice(0, 10);

    const doc = await client.create({
      _type: "Suggestion",
      suggestion: body.suggestion,
      suggestion_date: body.suggestion_date ?? today,
      suggestion_category: body.suggestion_category,
      suggestion_description: body.suggestion_description,
      suggestion_person_name: body.suggestion_person_name,
      suggestion_person_nbr: body.suggestion_person_nbr,
      suggestion_person_email: body.suggestion_person_email,
    });

    return json(201, { id: doc._id, status: "created" });
  } catch (e) {
    console.error("[Netlify suggestions] error:", e);
    return json(500, { error: "Failed to create suggestion" });
  }
};
