const fs = require("fs");


const handler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Prove01</title></head>");
    res.write("<body>");
    res.write("<h1>Account Creation</h1>");
    res.write("<h3>Enter Username:</h3>");
    res.write(
      '<form action="/create-user" method="POST"><input type="text" name="username" placeholder="Input Username Here"><button type="submit">Submit</button></form>'
    );
    res.write("</body>");
    res.write("</html>");
    res.end();
  }

  if (url === "/users") {
    return fs.readFile("userList.txt", "utf8", (err, data) => {
      if (err) console.log(err);
      const users = data.split("\n");
      res.write("<html>");
      res.write("<head><title>Prove01</title></head>");
      res.write("<body>");
      res.write("<h1>User List</h1>");
      res.write("<ul>");
      users.forEach((user) => {
        res.write("<li>" + user + "</li>");
      });
      res.write("</ul>");
      res.write("</body>");
      res.write("</html>");
      res.end();
    });
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const newUser = parsedBody.split("=")[1];
      console.log(newUser);
      return fs.appendFile("userList.txt", "\n" + newUser, (err) => {
        if (err) console.log(err);
        console.log("User added to record.");
        res.statusCode = 302;
        res.setHeader("Location", "/users");
        return res.end();
      });
    });
  }
};

exports.handler = handler;