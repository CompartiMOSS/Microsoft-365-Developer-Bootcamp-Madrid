import {
  AadHttpClientFactory,
  AadHttpClient,
  HttpClientResponse
} from "@microsoft/sp-http";

import { IHeroe } from "../model";

//TODO: Update you Function App URL
const API_RESOURCE_URI: string = "https://[XXXXXXX].azurewebsites.net";

export class HeroeService {

  constructor(private _endpoint: string, private _aadHttpClientFactory: AadHttpClientFactory) {

  }

  public async getHeroes(): Promise<IHeroe[]> {
    // TODO: complete from Lab
    return null; //TODO remove
  }
}
