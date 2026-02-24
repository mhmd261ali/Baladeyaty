// netlify/functions/users.ts
import type {
  Handler,
  HandlerEvent,
  HandlerResponse,
} from "@netlify/functions";
import { client } from "../lib/sanityClient";
import bcrypt from "bcryptjs";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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

type SignupBody = {
  action: "signup";
  email: string;
  password: string;
  name?: string;
};

type LoginBody = {
  action: "login";
  email: string;
  password: string;
};

type RequestBody = SignupBody | LoginBody;

export const handler: Handler = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: { ...corsHeaders },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return text(405, "Method Not Allowed");
  }

  if (!event.body) {
    return json(400, { error: "Missing request body" });
  }

  let body: RequestBody;
  try {
    body = JSON.parse(event.body);
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  if (!("action" in body)) {
    return json(400, { error: "Missing action (signup | login)" });
  }

  try {
    if (body.action === "signup") {
      return await handleSignup(body);
    }

    if (body.action === "login") {
      return await handleLogin(body);
    }

    return json(400, { error: "Unsupported action" });
  } catch (e) {
    console.error("[Netlify users] error:", e);
    return json(500, { error: "Internal server error" });
  }
};

// ---------- HELPERS ----------

async function handleSignup(body: SignupBody): Promise<HandlerResponse> {
  const { email, password, name } = body;

  if (!email || !password) {
    return json(400, { error: "Email and password are required" });
  }

  const query = `*[_type == "user" && email == $email][0]`;
  const existing = await client.fetch(query, { email });

  if (existing) {
    return json(409, { error: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const doc = await client.create({
    _type: "user",
    email,
    name: name || "",
    role: "user",
    passwordHash,
  });

  return json(201, {
    status: "created",
    user: {
      id: doc._id,
      email: doc.email,
      name: doc.name,
      role: doc.role,
    },
  });
}

async function handleLogin(body: LoginBody): Promise<HandlerResponse> {
  const { email, password } = body;

  if (!email || !password) {
    return json(400, { error: "Email and password are required" });
  }

  const query = `*[_type == "user" && email == $email][0]`;
  const user = await client.fetch<{
    _id: string;
    email: string;
    name?: string;
    role?: string;
    passwordHash?: string;
  } | null>(query, { email });

  if (!user || !user.passwordHash) {
    return json(401, { error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return json(401, { error: "Invalid credentials" });
  }

  return json(200, {
    status: "ok",
    user: {
      id: user._id,
      email: user.email,
      name: user.name ?? "",
      role: user.role ?? "user",
    },
  });
}
