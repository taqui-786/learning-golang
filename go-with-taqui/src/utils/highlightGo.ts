function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function highlightGoHtml(code: string): string {
  let s = escapeHtml(code);
  const strings: string[] = [];
  s = s.replace(/(`[^`]*`|"(?:\\.|[^"\\])*")/g, (m) => {
    strings.push(`<span class="tk-str">${m}</span>`);
    return `__STR_${strings.length - 1}__`;
  });

  const comments: string[] = [];
  s = s.replace(/(\/\/[^\n]*|--[^\n]*|#[^\n]*)/g, (m) => {
    comments.push(`<span class="tk-cm">${m}</span>`);
    return `__CM_${comments.length - 1}__`;
  });

  s = s.replace(
    /\b(package|import|func|var|const|type|struct|interface|return|if|else|for|range|switch|case|default|break|continue|defer|go|chan|select|map|nil|true|false|make|new|len|cap|append|copy|delete|close|panic|recover|any|error|int|int64|uint|float64|bool|string|byte|rune|FROM|WORKDIR|COPY|RUN|EXPOSE|ENTRYPOINT|USER|AS|SELECT|CREATE|TABLE|INDEX|BEGIN|UPDATE|SET|WHERE|COMMIT|PRIMARY|KEY|LIMIT|UNIQUE|NOT|NULL|service|rpc|returns|stream|message|syntax)\b/g,
    '<span class="tk-kw">$1</span>',
  );
  s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tk-num">$1</span>');
  s = s.replace(/(&amp;|&lt;-|:=)/g, '<span class="tk-op">$1</span>');
  s = s.replace(/__CM_(\d+)__/g, (_, i) => comments[Number(i)]);
  s = s.replace(/__STR_(\d+)__/g, (_, i) => strings[Number(i)]);
  return s;
}
