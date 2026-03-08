import { marked } from 'marked';

marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Convert markdown text to HTML, then apply citation chip replacements.
 * `chipClass` controls the CSS class on citation spans (landing page uses
 * clickable chips, chat view uses simple superscripts).
 */
export function formatMarkdown(
  text: string,
  chipMode: 'landing' | 'chat' = 'chat'
): string {
  const raw = text ?? '';
  let html = marked.parse(raw, { async: false }) as string;

  if (chipMode === 'landing') {
    html = html.replace(
      /\[S(\d+)\]/gi,
      '<span class="ref-chip ref-chip--landing">$1</span>'
    );
  } else {
    html = html.replace(
      /\[S(\d+)\]/gi,
      '<span class="ref-chip ref-chip--chat" data-ref="$1">$1</span>'
    );
  }

  return html;
}
