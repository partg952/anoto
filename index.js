import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
let app = express();

app.use(cors());

app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/github/webhook", (req, res) => {
    const event = req.headers["x-github-event"];

    console.log("📩 Event:", event);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log(req.body);
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Request body is empty or unsupported content-type."
        });
    }

    if (event === "pull_request") {
        const action = req.body.action;
        const pr = req.body.pull_request;
        const repo = req.body.repository.full_name;

        if (["opened", "synchronize", "reopened"].includes(action)) {
            console.log("PR detected");
            console.log("Repo:", repo);
            console.log("PR #:", pr.number);
            console.log("Title:", pr.title);
            console.log("Diff URL:", pr.diff_url);
            console.log("Branch:", pr.head.ref);
        }
    }

    res.sendStatus(200);
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
