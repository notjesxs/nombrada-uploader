const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const logsDir = path.join(__dirname, "..", "logs");

function getLogFiles() {
    if (!fs.existsSync(logsDir)) {
        return [];
    }

    return fs.readdirSync(logsDir)
        .filter(file => file.endsWith(".json"))
        .sort((a, b) => b.localeCompare(a))
        .map(file => {
            const fullPath = path.join(logsDir, file);
            const stats = fs.statSync(fullPath);

            return {
                name: file,
                size: stats.size,
                modifiedAt: stats.mtime.toISOString()
            };
        });
}

router.get("/", (req, res) => {
    try {
        res.json({
            ok: true,
            logs: getLogFiles()
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
});

router.get("/:filename", (req, res) => {
    try {
        const filename = path.basename(req.params.filename);
        const fullPath = path.join(logsDir, filename);

        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({
                ok: false,
                message: "No se encontró el log"
            });
        }

        const content = fs.readFileSync(fullPath, "utf8");
        const parsed = JSON.parse(content);

        res.json({
            ok: true,
            log: parsed,
            filename
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
});

module.exports = router;
