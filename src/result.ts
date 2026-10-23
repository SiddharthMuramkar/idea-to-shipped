// What a module returns when the input might be wrong: the value, or an exact
// error message the route sends back as 400 { error }. Shared by comments and quiz.
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };
