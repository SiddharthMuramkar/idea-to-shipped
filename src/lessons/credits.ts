// The credits manifest, content/image-credits.json: one credit per image,
// keyed by the image's path as headers write it ("/images/lessons/tdd.jpg").
// Keeping every credit in one file lets the credits page list them all, and
// an image used twice is credited once.
//
// This module only checks the manifest's shape, so the site never shows a
// credit of the wrong type. Whether a credit is good enough (an open
// licence, a named author, a real source) is the content lint's to say.

export type Credit = {
  title: string;
  author: string;
  // As the image's source page names it, e.g. "CC BY-SA 4.0" or "Public domain".
  license: string;
  licenseUrl: string | null;
  // The page the image comes from.
  source: string;
};

const TEXT_KEYS = ["title", "author", "license", "source"] as const;
const KEYS = ["title", "author", "license", "licenseUrl", "source"];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Throws every problem at once, one per line, each naming the image.
export function parseCredits(file: string, raw: string): Map<string, Credit> {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    throw new Error(`${file}: isn't valid JSON (${(error as Error).message}): fix the file so it parses`);
  }
  if (!isObject(data)) {
    throw new Error(
      `${file}: must hold one JSON object, keyed by each image's path, as in { "/images/lessons/tdd.jpg": { "title": … } }`,
    );
  }

  const credits = new Map<string, Credit>();
  const problems: string[] = [];
  for (const [image, entry] of Object.entries(data)) {
    const fail = (problem: string) => problems.push(`${file}: "${image}": ${problem}`);
    if (!isObject(entry)) {
      fail(`its credit must be an object with ${KEYS.join(", ")}`);
      continue;
    }
    const before = problems.length;
    for (const key of Object.keys(entry)) {
      if (!KEYS.includes(key)) fail(`unknown key "${key}": remove it (a credit's keys are ${KEYS.join(", ")})`);
    }
    for (const key of TEXT_KEYS) {
      if (typeof entry[key] !== "string") fail(`${key} must be a string: add it in double quotes`);
    }
    const licenseUrl = entry.licenseUrl ?? null;
    if (licenseUrl !== null && typeof licenseUrl !== "string") fail("licenseUrl must be a string, or null when there's none");
    if (problems.length > before) continue;
    credits.set(image, {
      title: entry.title as string,
      author: entry.author as string,
      license: entry.license as string,
      // An empty address would be a link to nowhere.
      licenseUrl: (licenseUrl as string | null) || null,
      source: entry.source as string,
    });
  }
  if (problems.length > 0) throw new Error(problems.join("\n"));
  return credits;
}
