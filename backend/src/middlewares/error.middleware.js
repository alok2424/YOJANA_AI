export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err?.name === "ZodError") {
    return res.status(400).json({ message: "Invalid input", issues: err.issues });
  }

  res.status(500).json({ message: "Server error" });
}