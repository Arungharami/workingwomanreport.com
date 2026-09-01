import fs from "node:fs";
import path from "node:path";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function assertTopic(topic: string | undefined): asserts topic is string {
  if (!topic?.trim()) {
    throw new Error('Usage: npm run story:new -- "Women in AI Leadership"');
  }
}

const topic = process.argv.slice(2).join(" ");
assertTopic(topic);

const slug = slugify(topic);
const today = new Date().toISOString().slice(0, 10);
const weeklyPath = path.join(process.cwd(), "content/weekly", `${slug}.json`);
const socialPath = path.join(process.cwd(), "content/social", `${slug}.json`);
const mediaRoot = path.join(process.cwd(), "public/media/weekly", `${today}-${slug}`);

if (fs.existsSync(weeklyPath) || fs.existsSync(socialPath)) {
  throw new Error(`A weekly story or social package already exists for ${slug}.`);
}

const template = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "content/templates/weekly-story-template.json"),
    "utf8",
  ),
) as Record<string, unknown>;

const weeklyStory = {
  ...template,
  id: `weekly-${today}-${slug}`,
  slug,
  title: topic,
  shortTitle: topic,
  status: "draft",
  isDemo: false,
  publishDate: today,
  updatedDate: today,
  canonicalUrl: `/this-week/${slug}`,
};

const socialPackage = {
  slug,
  youtube: {
    title: "",
    description: "",
    keywords: [],
    chapters: [],
    pinnedComment: "",
    shortTitle: "",
    shortCaption: "",
  },
  instagram: {
    caption: "",
    reelCaption: "",
    carouselSlides: [],
    hashtags: [],
    altText: "",
  },
  facebook: {
    post: "",
    shortPost: "",
    videoDescription: "",
  },
  tiktok: {
    hook: "",
    caption: "",
    onscreenText: [],
    hashtags: [],
  },
  x: {
    post1: "",
    post2: "",
    post3: "",
    thread: [],
  },
  newsletter: {
    subject: "",
    preview: "",
    body: "",
    callToAction: "",
  },
  website: {
    headline: topic,
    dek: "",
    excerpt: "",
    seoTitle: "",
    seoDescription: "",
  },
};

fs.writeFileSync(weeklyPath, `${JSON.stringify(weeklyStory, null, 2)}\n`);
fs.writeFileSync(socialPath, `${JSON.stringify(socialPackage, null, 2)}\n`);

for (const folder of ["hero", "video", "social", "thumbnails"]) {
  const dir = path.join(mediaRoot, folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, ".gitkeep"), "");
}

console.log(`Created weekly story: ${weeklyPath}`);
console.log(`Created social package: ${socialPath}`);
console.log(`Created media folders: ${mediaRoot}`);
