import { ICreateExampleRequest, ICreateExampleResponse } from './example.dto';
import { ExampleMapper } from '@biz/example/example.mapper';

export class ExampleBiz {
  public static async createExample(
    body: ICreateExampleRequest,
  ): Promise<ICreateExampleResponse> {
    // Check exist
    // Code here

    const exampleModel = ExampleMapper.fromBodyToSchema(body);
    console.log(exampleModel);

    // insert to database
    // Code here

    const exampleResponse = ExampleMapper.toExampleResponse({
      ...exampleModel,
      id: 'tungit2024',
    });

    return exampleResponse;
  }
}
