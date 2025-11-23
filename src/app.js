// src/index.js
import express from "express"
import cors from "cors"
import { sendError } from "./utils/sendError.js"

// import routes
import rootRouter from "./routes/root.js"
import moviesRouter from "./routes/movies.js"
import findMovieRouter from "./routes/find-movie.js"

const app = express();
// const port = 3000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// use routes
app.use("/", rootRouter)
app.use("/movies", moviesRouter)
app.use("/find-movie", findMovieRouter)


export function globalErrorHandler(err, req, res, next) {
  const status = err.status || 500
  const code = err.code || "INTERNAL_ERROR"
  const message = err.message || "Server error"

  const payload = {
    ok: false,
    error: {
      status,
      message,
      code
    }
  }

  if (err.details) {
    payload.error.details = err.details
  }

  res.status(status).json(payload)
}

export function error404(req, res, next) {
  next(sendError(404, "Route not found", "NOT_FOUND"))
}

// routes error 404
app.use(error404)

// global error handling
app.use(globalErrorHandler)

export default app