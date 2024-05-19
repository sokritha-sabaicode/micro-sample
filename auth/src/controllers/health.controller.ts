import { StatusCode } from "@auth/utils/consts";
import { Get, Route, SuccessResponse } from "tsoa";

@Route("/auth-health")
export class Health {
  @SuccessResponse(StatusCode.OK, "Success")
  @Get("/")
  public async checkHealth() {
    return { message: "API Gateway service is healthy and OK." };
  }
}
