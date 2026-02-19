document.querySelectorAll('div.highlight').forEach(block => {
  const code = block.querySelector('code');
  if (!code) return;
  const lang = [...code.classList]
    .find(c => c.startsWith('language-'))
    ?.replace('language-', '')
    ?.toUpperCase();
  if (!lang) return;

  const label = document.createElement('span');
  label.className = 'code-lang-label';
  label.textContent = lang;
  block.appendChild(label);
});
