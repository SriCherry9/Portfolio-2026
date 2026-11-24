/**
 * Every case study here is a sequence of static slide images (plus, for
 * Dilution Shock, a few poster frames). None of the page code itself is
 * lazy-loaded — React Router ships one bundle — so the only thing a visitor
 * actually waits on after navigating is these images. This manifest lets the
 * project-open transition kick off every one of them in the background while
 * its splash is still on screen, so by the time the case study mounts, its
 * images are already in the browser's cache instead of popping in one by one.
 */

const range = (count: number) => Array.from({ length: count }, (_, i) => i + 1)

const CASE_STUDY_IMAGES: Record<string, string[]> = {
  '/case-study/ai-product-strategy': range(16).map(n => `/images/ai-product-strategy/${n}.png`),

  '/case-study/cashless': [
    ...range(15).map(n => `/images/cashless-slide-${String(n).padStart(2, '0')}.png`),
    '/images/cashless-slide-constraints-metrics.png',
    '/images/cashless-slide-results-next-steps.png',
  ],

  '/case-study/dilution-shock': [
    'dilution-surprise.png', 'pre-vs-post-money.png', 'circular-math.png',
    'scenario-final-poster.jpg', 'competitors.png', 'prompt-suggestion.png',
    'ai-trust-builders.png', 'before-input.png', 'before-output.png',
    'ai-setup-iteration-1.png', 'prompt-through-pills-poster.jpg', 'manual-ai-flow.png',
    'scenario-on-scenario-iteration-1.png', 'scenario-on-scenario-iteration-2.png',
    'scenario-on-scenario-iteration-3.png', 'scenario-on-scenario-final-poster.jpg',
    'pro-rata-iteration-1.png', 'pro-rata-iteration-2.png', 'pro-rata-iteration-3.png',
    'pro-rata-conflict-resolution-poster.jpg', 'constraints-1.png', 'constraints-2.png',
    'constraints-3.png', 'constraints-final.png', 'dilution-insights.png',
  ].map(name => `/images/dilution-shock/${name}`),

  '/case-study/incite': range(33).map(n => `/images/incite/${n}.png`),

  '/case-study/luna': range(17).map(n => `/images/luna/${n}.png`),

  '/case-study/museo': range(21).map(n => `/images/museo/${n}.png`),

  '/case-study/ninjahire': [
    'change-checklist.png', 'cognitive-walkthrough-takeaways.png', 'cognitive-walkthrough.png',
    'competitor-analysis-takeaways.png', 'competitor-analysis.png', 'context-problem.png',
    'heuristic-evaluation.png', 'information-architecture.png', 'login-final.png',
    'login-iteration-1.png', 'login-iteration-2.png', 'login-iteration-3.png', 'login-iteration-4.png',
    'product-tour-final.png', 'product-tour-iteration-1.png', 'product-tour-iteration-2.png',
    'product-tour-iteration-3.png', 'service-blueprint.png', 'setup-final.png',
    'setup-iteration.png', 'solution.png',
  ].map(name => `/images/ninjahire/${name}`),

  '/case-study/hfe-inhaler': range(11).map(n => `/images/hfe-inhaler/hfe-inhaler-slide-${String(n).padStart(2, '0')}.png`),

  '/case-study/comic-strip': range(10).map(n => `/images/C${n}.png`),
}

function preloadImage(src: string): Promise<void> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve() // a missing/slow asset shouldn't block the transition forever
    img.src = src
  })
}

/**
 * Kicks off every image for the given case study path and resolves once
 * they've all settled (loaded or failed). Unknown paths resolve immediately.
 * Preloading isn't cancelled if the caller stops waiting on this promise —
 * the browser keeps fetching in the background, so even a slow connection
 * that times out the transition is still further along by the time the page
 * itself requests the same images.
 */
export function preloadCaseStudyImages(path: string): Promise<void> {
  const images = CASE_STUDY_IMAGES[path]
  if (!images || images.length === 0) return Promise.resolve()
  return Promise.all(images.map(preloadImage)).then(() => undefined)
}
