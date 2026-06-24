const http = require('http');
const fs = require('fs');
const { URL } = require('url');

const PASSWORD = 'pass';

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Save form
  if (url.pathname === '/submit') {
    const name = url.searchParams.get('name');
    const age = url.searchParams.get('age');
    const studentClass = url.searchParams.get('class');
    const email = url.searchParams.get('email');

    fs.appendFileSync(
      'data.txt',
      `Name: ${name}, Age: ${age}, Class: ${studentClass}, Email: ${email}\n`
    );

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Saved!</h1>');
    return;
  }

  // Admin page
  if (url.pathname === '/admin') {
    const pass = url.searchParams.get('pass');

    if (pass !== PASSWORD) {
      res.writeHead(401, { 'Content-Type': 'text/html' });
      res.end('<h1>Wrong Password</h1>');
      return;
    }

    let data = 'No submissions yet';

    if (fs.existsSync('data.txt')) {
      data = fs.readFileSync('data.txt', 'utf8');
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>Saved Submissions</h1>
      <pre>${data}</pre>
    `);
    return;
  }

  // Form page
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <h1>Student Information Form</h1>

    <form action="/submit">
      <input type="text" name="name" placeholder="Full Name" required><br><br>

      <input type="number" name="age" placeholder="Age" required><br><br>

      <input type="text" name="class" placeholder="Class" required><br><br>

      <input type="email" name="email" placeholder="Email"><br><br>

      <button type="submit">Submit</button>
    </form>
  `);
});

server.listen(3000, () => {
  console.log('Server running');
});