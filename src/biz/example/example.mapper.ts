import {
  ICreateExampleRequest,
  ICreateExampleResponse,
  IExample,
} from './example.dto';

export class ExampleMapper {
  public static fromBodyToSchema(req: ICreateExampleRequest): IExample {
    return {
      ...req,
    };
  }

  public static toExampleResponse(
    data: ICreateExampleResponse,
  ): ICreateExampleResponse {
    return {
      id: data.id,
      name: data.name,
      tiktok: data.tiktok,
      facebook: data.facebook,
      youtube: data.youtube,
    };
  }
}
