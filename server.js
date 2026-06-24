const http = require('http');
const fs = require('fs');
const { URL } = require('url');

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Save form data
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
        res.end('<h1>Saved!</h1><br><a href="/">Back</a>');
        return;
    }

    // View saved submissions
    if (url.pathname === '/view') {
        const data = fs.existsSync('data.txt')
            ? fs.readFileSync('data.txt', 'utf8')
            : 'No submissions yet';

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
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

        <br>
        <a href="/view">View Saved Submissions</a>
    `);
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});