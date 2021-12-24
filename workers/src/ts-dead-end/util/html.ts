// export class Scaper {
//   private selector
//   private
//   constructor(private readonly selector) {

//   }
// }

export async function scrape(
  response: Response,
  selectors: string[]
): Promise<Record<string, string[][]>> {
  const rewriter = new HTMLRewriter()

  const matches: Record<string, (string | true)[]> = {}

  selectors.forEach((selector) => {
    matches[selector] = []

    let nextText = ''

    rewriter.on(selector, {
      element() {
        matches[selector].push(true)
        nextText = ''
      },

      text(text) {
        nextText += text.text

        if (text.lastInTextNode) {
          matches[selector].push(nextText)
          nextText = ''
        }
      },
    })
  })

  const transformed = rewriter.transform(response)

  await transformed.text()

  const result: Record<string, string[][]> = {}

  selectors.forEach((selector) => {
    const nodeCompleteTexts = []

    let nextText: string[] = []

    matches[selector].forEach((text) => {
      if (text === true) {
        if (nextText.length === 0) return
        nodeCompleteTexts.push(nextText)
        nextText = []
      } else {
        const next = cleanText(text)
        if (next) nextText.push(next)
      }
    })

    if (nextText.length) nodeCompleteTexts.push(nextText)
    result[selector] = nodeCompleteTexts
  })

  return result
}

function cleanText(s: string): string {
  return s.trim().replace(/\s\s+/g, ' ')
}
