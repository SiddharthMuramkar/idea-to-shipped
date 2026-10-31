import { listComments, postComment } from "@/comments/comments";

// This file only speaks HTTP. Validation and SQL live in the comments module.

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("lesson") ?? "";
  const result = await listComments(slug);
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });
  return Response.json(result.value);
}

export async function POST(request: Request) {
  let input;
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }
  const result = await postComment(input);
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });
  return Response.json(result.value, { status: 201 });
}
