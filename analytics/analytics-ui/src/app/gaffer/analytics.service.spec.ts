import { TestBed, async, fakeAsync, tick } from "@angular/core/testing";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { AnalyticsService } from "./analytics.service";
import { QueryService } from "./query.service";
import { ErrorService } from "../dynamic-input/error.service";
import { CommonService } from "../dynamic-input/common.service";
import { ResultsService } from "./results.service";
import { EndpointService } from "../config/endpoint-service";

class QueryServiceStub {
  executeQuery = (operation, onSuccess) => {
    onSuccess();
  };
}
class ErrorServiceStub {
  handle = () => {};
}
class CommonServiceStub {
  startsWith = function(str, prefix) {
    // to support ES5
    return str.indexOf(prefix) === 0;
  };
  parseUrl = url => {
    if (!this.startsWith(url, "http")) {
      url = "http://" + url;
    }

    return url;
  };
}
class HttpClientStub {
  post = params => {
    return;
  };
}
class RouterStub {
  navigate = params => {};
}
class ResultsServiceStub {
  clear = () => {};
}
class EndpointServiceStub {
  getRestEndpoint = () => {
    return "http://localhost:8080" + "/rest/latest";
  };
}

describe("AnalyticsService", () => {
  let service: AnalyticsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: QueryService, useClass: QueryServiceStub },
        { provide: ErrorService, useClass: ErrorServiceStub },
        { provide: CommonService, useClass: CommonServiceStub },
        { provide: HttpClient, useClass: HttpClientStub },
        { provide: Router, useClass: RouterStub },
        { provide: ResultsService, useClass: ResultsServiceStub },
        { provide: EndpointService, useClass: EndpointServiceStub }
      ]
    }).compileComponents();

    service = TestBed.get(AnalyticsService);
  }));

  it("Should be able to get the analytic", () => {
    let analytic = [0, 1, 2];
    service.arrayAnalytic = analytic;

    let result = service.getAnalytic();

    expect(result).toEqual(analytic);
  });

  it("Should be able to update the analytic", () => {
    let newValue = 8;
    let parameterName = "key1";
    service.arrayAnalytic = {
      uiMapping: [
        [
          "key1",
          {
            label: "Label",
            userInputType: "TextBox",
            parameterName: "Parameter Name",
            inputClass: "java.lang.Integer"
          }
        ]
      ]
    };
    let arrayAnalytic = {
      uiMapping: [
        [
          "key1",
          {
            label: "Label",
            userInputType: "TextBox",
            parameterName: "Parameter Name",
            inputClass: "java.lang.Integer",
            currentValue: newValue
          }
        ]
      ]
    };

    service.updateAnalytic(newValue, parameterName);

    expect(service.arrayAnalytic).toEqual(arrayAnalytic);
  });

  it("Should be able to create the iterable array analytic", () => {
    let analytic = {
      uiMapping: {
        key1: {
          label: "Label",
          userInputType: "TextBox",
          parameterName: "Parameter Name",
          inputClass: "java.lang.Integer"
        }
      }
    };
    let arrayAnalytic = {
      uiMapping: [
        [
          "key1",
          {
            label: "Label",
            userInputType: "TextBox",
            parameterName: "Parameter Name",
            inputClass: "java.lang.Integer",
            currentValue: null
          }
        ]
      ]
    };

    service.createArrayAnalytic(analytic);

    expect(service.arrayAnalytic).toEqual(arrayAnalytic);
  });

  it("Should be able to clear the table results after execution", () => {
    let resultsService = TestBed.get(ResultsService);
    let spy = spyOn(resultsService, "clear");
    service.arrayAnalytic = {
      operationName: "Test name"
    };

    service.executeAnalytic();

    expect(spy).toHaveBeenCalled();
  });

  it("Should be able to navigate to the results page after execution", () => {
    let router = TestBed.get(Router);
    let spy = spyOn(router, "navigate");
    service.arrayAnalytic = {
      operationName: "Test name"
    };

    service.executeAnalytic();

    expect(spy).toHaveBeenCalledWith(["/results"]);
  });

  it("Should be able to execute the analytic", () => {
    let operationName = "test name";
    service.arrayAnalytic = {
      uiMapping: [
        [
          "key1",
          {
            label: "Label",
            userInputType: "TextBox",
            parameterName: "param1",
            inputClass: "java.lang.Integer",
            currentValue: "value1"
          }
        ],
        [
          "key2",
          {
            label: "Label",
            userInputType: "TextBox",
            parameterName: "param2",
            inputClass: "java.lang.Integer",
            currentValue: "value2"
          }
        ]
      ],
      operationName: operationName
    };
    let parametersMap = {
      param1: "value1",
      param2: "value2"
    };
    let operation = {
      class: "uk.gov.gchq.gaffer.named.operation.NamedOperation",
      operationName: operationName,
      parameters: parametersMap
    };
    let queryService = TestBed.get(QueryService);
    let spy = spyOn(queryService, "executeQuery");

    service.executeAnalytic();

    expect(spy).toHaveBeenCalledWith(operation, jasmine.any(Function));
  });

  it("should be able to post a request to the server", fakeAsync(() => {
    let http = TestBed.get(HttpClient);
    let spy = spyOn(http, "post");
    let common = TestBed.get(CommonService);
    let endpoint = TestBed.get(EndpointService);
    let queryUrl = common.parseUrl(
      endpoint.getRestEndpoint() + "/graph/operations/execute"
    );
    let operation = {
      class: "uk.gov.gchq.gaffer.operation.analytic.GetAllAnalytics"
    };
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    service.reloadAnalytics(true).subscribe(() => {}, () => {});

    tick();
    expect(spy).toHaveBeenCalledWith(queryUrl, operation, { headers: headers });
  }));
});
