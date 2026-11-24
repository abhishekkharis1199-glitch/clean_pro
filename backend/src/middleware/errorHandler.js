export function errorHandler(error, req, res, next) {
  console.error(error)

  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message })
  }

  res.status(500).json({ message: 'Internal server error' })
}
