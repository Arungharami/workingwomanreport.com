import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const personSchema = z.object({
  name: z.string(),
  slug: z.string(),
  role: z.string(),
  shortBio: z.string(),
  fullBio: z.array(z.string()),
  photo: z.string(),
  photoAlt: z.string(),
  email: z.string().email(),
  website: z.string().url(),
  socials: z.record(z.string(), z.string().url()),
  areasOfCoverage: z.array(z.string()),
  featuredStories: z.array(z.string()),
  verifiedBio: z.array(z.string()),
  placeholders: z.array(z.string()),
});

export type PersonProfile = z.infer<typeof personSchema>;

export function getPeople(): PersonProfile[] {
  const dir = path.join(process.cwd(), "content/people");
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) =>
      personSchema.parse(JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"))),
    );
}

export function getPerson(slug: string) {
  return getPeople().find((person) => person.slug === slug);
}
