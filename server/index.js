const cors = require("cors");
const express = require("express");
const { Pool } = require("pg");

const PORT = Number(process.env.PORT || 3000);
const DATABASE_URL = process.env.DATABASE_URL;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
const pool = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: DATABASE_URL.includes("localhost") || DATABASE_URL.includes("127.0.0.1") ? false : { rejectUnauthorized: false }
    })
  : null;

app.use(express.json({ limit: "64kb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === "null" || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    }
  })
);

app.get("/api/health", async (_request, response) => {
  if (!pool) {
    response.status(503).json({ ok: false, database: "missing DATABASE_URL" });
    return;
  }

  try {
    await pool.query("select 1");
    response.json({ ok: true, database: "connected" });
  } catch (error) {
    response.status(503).json({ ok: false, database: "unreachable", error: error.message });
  }
});

app.post("/api/save-point-answers", async (request, response) => {
  if (!pool) {
    response.status(503).json({ error: "DATABASE_URL is not configured" });
    return;
  }

  const payload = normalizePayload(request.body || {});
  const validationError = validatePayload(payload);
  if (validationError) {
    response.status(400).json({ error: validationError });
    return;
  }

  try {
    const result = await pool.query(
      `insert into save_point_answers (
        session_id,
        save_point_id,
        save_point_label,
        question,
        answer,
        mode,
        lead_score,
        projected_revenue,
        conversion_rate,
        deal_score,
        payload,
        user_agent
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12)
      returning id, created_at`,
      [
        payload.sessionId,
        payload.savePointId,
        payload.savePointLabel,
        payload.question,
        payload.answer,
        payload.mode,
        payload.leadScore,
        payload.projectedRevenue,
        payload.conversionRate,
        payload.dealScore,
        JSON.stringify(payload.context),
        request.get("user-agent") || ""
      ]
    );

    response.status(201).json({
      id: result.rows[0].id,
      createdAt: result.rows[0].created_at
    });
  } catch (error) {
    response.status(500).json({ error: "Could not save answer", detail: error.message });
  }
});

app.get("/api/save-point-answers", async (request, response) => {
  if (!pool) {
    response.status(503).json({ error: "DATABASE_URL is not configured" });
    return;
  }

  const sessionId = String(request.query.sessionId || "").trim();
  const values = [];
  let whereClause = "";

  if (sessionId) {
    values.push(sessionId);
    whereClause = "where session_id = $1";
  }

  const result = await pool.query(
    `select
      id,
      session_id as "sessionId",
      save_point_id as "savePointId",
      save_point_label as "savePointLabel",
      question,
      answer,
      mode,
      lead_score as "leadScore",
      projected_revenue as "projectedRevenue",
      conversion_rate as "conversionRate",
      deal_score as "dealScore",
      payload as context,
      created_at as "createdAt"
    from save_point_answers
    ${whereClause}
    order by created_at desc
    limit 100`,
    values
  );

  response.json({ answers: result.rows });
});

async function initializeDatabase() {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured");
  }

  await pool.query(`
    create table if not exists save_point_answers (
      id bigserial primary key,
      session_id text not null,
      save_point_id text not null,
      save_point_label text not null,
      question text not null,
      answer text not null,
      mode text not null default 'marketing',
      lead_score integer,
      projected_revenue integer,
      conversion_rate numeric,
      deal_score integer,
      payload jsonb not null default '{}'::jsonb,
      user_agent text,
      created_at timestamptz not null default now()
    );
  `);

  await pool.query("create index if not exists save_point_answers_session_idx on save_point_answers (session_id, created_at desc);");
  await pool.query("create index if not exists save_point_answers_save_point_idx on save_point_answers (save_point_id, created_at desc);");
}

function normalizePayload(body) {
  return {
    sessionId: cleanString(body.sessionId, 120),
    savePointId: cleanString(body.savePointId, 80),
    savePointLabel: cleanString(body.savePointLabel, 120),
    question: cleanString(body.question, 500),
    answer: cleanString(body.answer, 2000),
    mode: cleanString(body.mode || "marketing", 40),
    leadScore: cleanInteger(body.leadScore),
    projectedRevenue: cleanInteger(body.projectedRevenue),
    conversionRate: cleanNumber(body.conversionRate),
    dealScore: cleanInteger(body.dealScore),
    context: typeof body.context === "object" && body.context !== null ? body.context : {}
  };
}

function validatePayload(payload) {
  if (!payload.sessionId) return "sessionId is required";
  if (!payload.savePointId) return "savePointId is required";
  if (!payload.savePointLabel) return "savePointLabel is required";
  if (!payload.question) return "question is required";
  if (!payload.answer) return "answer is required";
  return null;
}

function cleanString(value, maxLength) {
  return String(value || "")
    .trim()
    .slice(0, maxLength);
}

function cleanInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : null;
}

function cleanNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Sniffing API listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database", error);
    process.exit(1);
  });
