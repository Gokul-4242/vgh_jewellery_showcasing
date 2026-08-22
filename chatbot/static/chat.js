document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('message');
  const out = document.getElementById('messages');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;
    append('You', msg);
    input.value = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      if (data.reply) append('Bot', data.reply);
      else if (data.error) append('Error', data.error);
    } catch (err) {
      append('Error', err.message);
    }
  });

  function append(who, text) {
    const p = document.createElement('div');
    p.innerHTML = '<strong>' + who + ':</strong> ' + escapeHtml(text);
    out.appendChild(p);
    window.scrollTo(0, document.body.scrollHeight);
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
