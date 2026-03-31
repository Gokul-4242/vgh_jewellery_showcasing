const fs = require('fs');
const html = fs.readFileSync('src/app/features/checkout-payment/checkout-payment.html', 'utf8');
const css = fs.readFileSync('src/app/features/checkout-payment/checkout-payment.css', 'utf8');
const rx = /class="([^"]+)"/g;
const classes = new Set();
let m;
while ((m = rx.exec(html)) !== null) {
  for (const c of m[1].split(/\s+/).filter(Boolean)) {
    classes.add(c);
  }
}
const missing = [];
for (const c of classes) {
  const escaped = '.' + c.replace(/\\/g, '\\\\').replace(/\//g, '\\/').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\:/g, '\\:').replace(/\-/g, '\\-');
  const rxTest = new RegExp(escaped + '\\s*[{,]');
  if (!rxTest.test(css) && !css.includes(escaped)) {
    missing.push(c);
  }
}
console.log(JSON.stringify(missing, null, 2));
