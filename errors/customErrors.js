class HttpError extends Error {
  status;
}

class BadRequest extends HttpError {
  constructor(message = 'Bad request') {
    super(message);

    this.status = 400;
  }
}

class NotFound extends HttpError {
  constructor(message = 'Not found') {
    super(message);

    this.status = 404;
  }
}

class Unauthorized extends HttpError {
  constructor(message = 'Unauthorized') {
    super(message);

    this.status = 401;
  }
}

module.exports = { BadRequest, NotFound, Unauthorized };
