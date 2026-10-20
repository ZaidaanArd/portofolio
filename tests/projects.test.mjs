import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import vm from "node:vm"
import { createRequire } from "node:module"
import ts from "typescript"
import { renderToStaticMarkup } from "react-dom/server"
import { jsx } from "react/jsx-runtime"

const require = createRequire(import.meta.url)
const modules = new Map()
const notFoundError = new Error("not-found")

function loadModule(path) {
  if (modules.has(path)) return modules.get(path)
  const source = fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText
  const exports = {}
  vm.runInNewContext(compiled, {
    exports, URL,
    require: id => {
      if (id === "@/data/site") return { siteUrl: new URL("https://example.test") }
      if (id === "next/navigation") return { notFound: () => { throw notFoundError } }
      if (id === "next/link") return { default: ({ children, ...props }) => jsx("a", { ...props, children }), __esModule: true }
      if (id.endsWith("BrowserFrame")) return { default: ({ src, alt }) => jsx("img", { src, alt }), __esModule: true }
      if (id.endsWith("PointerParallax")) return { default: ({ children, ...props }) => jsx("div", { ...props, children }), __esModule: true }
      if (id.startsWith("@/")) return loadModule(`${id.slice(2)}.ts`)
      if (id.startsWith("./")) return loadModule(`components/${id.slice(2)}.tsx`)
      return require(id)
    },
  })
  modules.set(path, exports)
  return exports
}

const data = loadModule("data/projects.ts")
const card = loadModule("components/ProjectCard.tsx").default
const page = loadModule("app/projects/[slug]/page.tsx")
const sitemap = loadModule("app/sitemap.ts").default

test("Sthana follows LevelUp with honest status and team attribution", () => {
  assert.deepEqual(Array.from(data.projects, project => project.id), ["levelup-lms", "sthana-kampus"])
  const project = data.getProject("sthana-kampus")
  assert.equal(project.status, "in-progress")
  assert.equal(project.hasCaseStudy, false)
  assert.equal(project.role, "Brand & UI Lead")
  assert.equal(project.team, "Team project")
  assert.equal(project.result, undefined)
  assert.equal(project.recognition, undefined)
  assert.equal(project.dashboardImage, "/images/sthana-beranda-user.png")
})

test("only opted-in projects are generated and indexed", () => {
  assert.deepEqual(Array.from(data.caseStudyProjects, project => project.id), ["levelup-lms"])
  assert.deepEqual(Array.from(page.generateStaticParams(), params => params.slug), ["levelup-lms"])
  assert.deepEqual(Array.from(sitemap(), entry => entry.url), ["https://example.test/", "https://example.test/projects/levelup-lms"])
})

test("unpublished and unknown case studies return not-found without metadata", async () => {
  for (const slug of ["sthana-kampus", "missing-project"]) {
    const props = { params: Promise.resolve({ slug }) }
    assert.equal(Object.keys(await page.generateMetadata(props)).length, 0)
    await assert.rejects(page.default(props), error => error === notFoundError)
  }
  const metadata = await page.generateMetadata({ params: Promise.resolve({ slug: "levelup-lms" }) })
  assert.equal(metadata.title, "LevelUp")
})

test("Sthana card keeps layered parallax screenshots and independent external links", () => {
  const html = renderToStaticMarkup(jsx(card, { project: data.getProject("sthana-kampus") }))
  assert.match(html, /In progress/)
  assert.match(html, /Brand &amp; UI Lead · Team project/)
  assert.match(html, /bg-paper/)
  assert.match(html, /sthana-landing.webp/)
  assert.match(html, /sthana-beranda-user.png/)
  assert.match(html, /data-parallax-depth="6"/)
  assert.match(html, /data-parallax-depth="12"/)
  assert.equal((html.match(/<a /g) ?? []).length, 4)
  assert.equal((html.match(/<img /g) ?? []).length, 2)
  assert.doesNotMatch(html, /\/projects\/sthana|Read case study/)
  assert.match(html, /Live demo/)
  assert.match(html, /Team repo/)
  assert.equal((html.match(/rel="noopener noreferrer"/g) ?? []).length, 4)
  assert.doesNotMatch(html, /<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<a\b/)
})

test("legacy LevelUp keeps the featured layout and case-study links", () => {
  const html = renderToStaticMarkup(jsx(card, { project: data.getProject("levelup-lms") }))
  assert.match(html, /bg-solid/)
  assert.match(html, /data-parallax-depth="6"/)
  assert.match(html, /data-parallax-depth="12"/)
  assert.match(html, /\/projects\/levelup-lms/)
  assert.match(html, /Read case study/)
  assert.doesNotMatch(html, /In progress|Completed/)
})

test("status is optional and a repository-only card never links to an unpublished route", () => {
  const project = { ...data.getProject("sthana-kampus"), status: undefined, demoUrl: undefined }
  const html = renderToStaticMarkup(jsx(card, { project }))
  assert.doesNotMatch(html, /In progress|Completed|Live demo|\/projects\/sthana/)
  assert.equal((html.match(/href="https:\/\/github.com\/ZaidaanArd\/ProjectPPK"/g) ?? []).length, 3)
})
