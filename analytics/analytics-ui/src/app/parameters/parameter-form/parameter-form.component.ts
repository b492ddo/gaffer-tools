/*
 * Copyright 2019 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-parameter-form',
  templateUrl: './parameter-form.component.html'
})
export class ParameterFormComponent implements OnInit {
  @Input() parameters;

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    // Go through the list of parameters and extract the class of the iterable inputs
    for (const i in this.parameters) {
      let param = this.parameters[i];
      let split = param[1].userInputType.split("-");
      if (split.length > 1) {
        this.parameters[i][1].userInputType = split[0];
        this.parameters[i][1].iterableClass = split[1];
      }
    }
  }

  /** Update the analytic operation whenever a parameter changes */
  onChange = function(parameter, parameterName) {
    // Convert date parameters into the right form
    if (parameter instanceof Date) {
      parameter = parameter.getFullYear() + '-'
        + ('0' + (parameter.getMonth() + 1)).slice(-2) + '-'
        + ('0' + parameter.getDate()).slice(-2);
    }

    // Convert iterable parameters into the right form
    for (const i in this.parameters) {
      let param = this.parameters[i];
      if (param[0] == parameterName && param[1].userInputType == "iterable") {
        let iterableObject = [];
        let inputValues = parameter.split("\n");
        for (const inputValue of inputValues) {
          let inputObject = {
            class: param[1].iterableClass,
            vertex: inputValue
          }
          iterableObject.push(inputObject);
        }
        parameter = iterableObject;
        break;
      }
    }

    this.analyticsService.updateAnalytic(parameter, parameterName);
    const analytic = this.analyticsService.getAnalytic();
    this.parameters = analytic.uiMapping;
  };
}
