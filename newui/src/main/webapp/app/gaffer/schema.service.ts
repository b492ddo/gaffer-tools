/*
 * Copyright 2017-2019 Crown Copyright
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

import { Injectable } from "@angular/core";
import { Observable, Observer, of } from "rxjs";
import { OperationOptionsService } from "../options/operation-options.service";
import { ErrorService } from '../dynamic-input/error.service';
import { QueryService } from './query.service';

@Injectable()

//Used to store and get the selected analytic
export class SchemaService {
  selectedAnalytic;
  schemaObservable; 
  schema;
  schemaVertices = {};

  constructor(private operationOptions: OperationOptionsService,
              private error: ErrorService,
              private query: QueryService) 
              
  {
    this.update().subscribe(function() {}, function() {});
  }

  /**
   * Asynchronously gets the schema. It will reject the promise if it fails to get the schema but won't
   * broadcast an error. The schema will be saved until update is called to reduce number of http requests.
   * If called while an existing request is in progress, it will be resolved by the existing request,
   * rather than sending another one.
   */
  get = function() {
    if (this.schema) {
      return of(this.schema);
    } else if (!this.schemaObservable) {
      this.schemaObservable = Observable.create((observer: Observer<String>) => {
        this.getSchema(null, observer);
      });
      
    }
    return this.schemaObservable;
  };

  /**
   * Creates the get schema operation using the default operation options.
   * @param {Boolean} loud Flag passed down to indicate whether to broadcast errors
   */
  private getSchema = function(loud, observer) {
    var getSchemaOperation = this.operationService.createGetSchemaOperation();
    if (Object.keys(getSchemaOperation.options).length === 0) {
      this.operationOptions
        .getDefaultOperationOptionsAsync()
        .subscribe((options) => {
          getSchemaOperation.options = options;
          this.getSchemaWithOperation(getSchemaOperation, loud, observer);
        });
    } else {
      this.getSchemaWithOperation(getSchemaOperation, loud, observer);
    }
  };

  /**
   * Runs the GetSchema operation. Will fail if the Request sends back a non-200 response or the query.execute method
   * errors
   * @param {Operation} operation The GetSchema operation
   * @param {*} loud A flag indicating whether to broadcast errors
   */
  private getSchemaWithOperation = function(operation, loud, observer) {
    try {
      this.query.execute(
        operation,
        (response) => {
          this.schema = response;
          if (!this.schema.entities) {
            this.schema.entities = {};
          }
          if (!this.schema.edges) {
            this.schema.edges = {};
          }
          if (!this.schema.types) {
            this.schema.types = {};
          }

          this.updateSchemaVertices();
          observer.next(this.schema);
          observer.complete(undefined);
        },
        (err) => {
          observer.error(err);
          if (loud) {
            this.error.handle("Failed to load schema", null, err);
            console.error(err);
          }
          observer.complete(undefined);
        }
      );
    } catch (e) {
      observer.error(e);
      if (loud) {
        this.error.handle("Failed to load schema", null, e);
        console.error(e);
      }
      observer.complete(undefined);
    }
  };

  /**
   * Updates the schema service
   * Rejects all current promises if outstanding. Then loudly loads the schema.
   * Once finished, the schema or error is returned.
   */
  update = function() {
    if (this.schemaObservable) {
      this.schemaObservable.throw("Reloading the schema");
    }
    this.schemaObservable = Observable.create(
      (observer: Observer<String>) => {this.getSchema(true, observer);
    });

    return this.schemaObservable;
  };

  /**
   * Returns the schema vertices.
   */
  getSchemaVertices = function() {
    return this.schemaVertices;
  };

  /**
   * Function which updates the schema vertices.
   */
  private updateSchemaVertices = function() {
    var vertices = [];
    if (this.schema) {
      for (var i in this.schema.entities) {
        if (vertices.indexOf(this.schema.entities[i].vertex) == -1) {
          vertices.push(this.schema.entities[i].vertex);
        }
      }
      for (var i in this.schema.edges) {
        if (vertices.indexOf(this.schema.edges[i].source) == -1) {
          vertices.push(this.schema.edges[i].source);
        }
        if (vertices.indexOf(this.schema.edges[i].destination) == -1) {
          vertices.push(this.schema.edges[i].destination);
        }
      }
    }

    this.schemaVertices = vertices;
  };
}
