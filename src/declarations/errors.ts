import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";

export abstract class CustomError extends Error {
  public readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

  constructor(msg: string, httpStatus: number) {
    super(msg);
    this.HttpStatus = httpStatus;
  }
}

export const INSERT_RECORD_ERROR_MESSAGE =
  "Something went wrong while creating record, please try again";

export class ServerError extends CustomError {
  public static readonly HttpStatus = HttpStatusCodes.INTERNAL_SERVER_ERROR;

  constructor(msg: string) {
    super(msg, ServerError.HttpStatus);
  }
}

export class ParamMissingError extends CustomError {
  public static readonly Default_Msg =
    "One or more of the required parameters was missing.";
  public static readonly Param_Msg_Prefix = "parameter missing:";
  public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

  constructor(params?: string[]) {
    const message = params?.length
      ? ParamMissingError.Param_Msg_Prefix + params.toString()
      : ParamMissingError.Default_Msg;
    super(message, ParamMissingError.HttpStatus);
  }
}

export class UnauthorizedError extends CustomError {
  public static readonly Msg = "Unauthorized to access data.";
  public static readonly HttpStatus = HttpStatusCodes.UNAUTHORIZED;

  constructor() {
    super(UnauthorizedError.Msg, UnauthorizedError.HttpStatus);
  }
}

export class FileNotFoundError extends CustomError {
  public static readonly Msg =
    "File with the given id does not exists in the database.";
  public static readonly HttpStatus = HttpStatusCodes.NOT_FOUND;

  constructor() {
    super(FileNotFoundError.Msg, FileNotFoundError.HttpStatus);
  }
}

export class NotFoundError extends CustomError {
  public static readonly Msg =
    "Record with the given id does not exists in the database.";
  public static readonly HttpStatus = HttpStatusCodes.NOT_FOUND;

  constructor() {
    super(NotFoundError.Msg, NotFoundError.HttpStatus);
  }
}

/**
 * Route Error with status code and message
 */
export class RouteError extends Error {
  status: HttpStatusCodes;
  constructor(status: HttpStatusCodes, message: string) {
    super(message);
    this.status = status;
  }
}
