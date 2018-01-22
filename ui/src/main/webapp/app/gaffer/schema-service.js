/*
 * Copyright 2017 Crown Copyright
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

'use strict';

angular.module('app').factory('schema', ['$http', 'config', '$q', 'common', 'operationService', 'query', function($http, config, $q, common, operationService, query) {

    var schemaService = {};

    var schema;
    var schemaVertices = {};

    schemaService.get = function() {
        var defer = $q.defer();
        if (schema) {
            defer.resolve(schema);
        } else {
            load(defer);
        }
        return defer.promise;
    }

    schemaService.update = function() {
        var defer = $q.defer();
        load(defer);
        return defer.promise;
    }

    schemaService.getSchemaVertices = function() {
        return schemaVertices;
    }

    var loadSchemaFromUrl = function(conf, defer) {
        var queryUrl = common.parseUrl(conf.restEndpoint + "/graph/config/schema");
        $http.get(queryUrl)
            .success(function(response){
                schema = response;
                defer.resolve(schema)
                updateSchemaVertices()
            })
            .error(function(err) {
                defer.reject(err);
                if (err !== "") {
                    alert("Unable to load schema: " + err.simpleMessage);
                    console.log(err);
                } else {
                    alert("Unable to load schema. Received no response");
                }
        });
    }

    var loadSchemaFromOperation = function(conf, defer) {
        try {
            query.execute(
                JSON.stringify(operationService.createGetSchemaOperation()),
                function(response) {
                    schema = response;
                    defer.resolve(schema)
                    updateSchemaVertices()
                },
                function(err) {
                    if (err !== "") {
                        console.log(err);
                    } else {
                        alert("Unable to load schema. Received no response");
                    }
                    loadSchemaFromUrl(conf, defer);
                }
            );
        } catch(e) {
            loadSchemaFromUrl(conf, defer);
       }
    }

    var load = function(defer) {
        config.get().then(function(conf) {
            defer = $q.defer();
            loadSchemaFromOperation(conf, defer),
            function(err) {
                defer.reject(err);
                if (err !== "") {
                    alert("Unable to load schema: " + err.simpleMessage);
                    console.log(err);
                } else {
                    alert("Unable to load schema. Received no response");
                }
            };
        });
    }

    var updateSchemaVertices = function() {
        var vertices = [];
        if(schema) {
            for(var i in schema.entities) {
                if(vertices.indexOf(schema.entities[i].vertex) == -1) {
                    vertices.push(schema.entities[i].vertex);
                }
            }
            for(var i in schema.edges) {
                if(vertices.indexOf(schema.edges[i].source) == -1) {
                    vertices.push(schema.edges[i].source);
                }
                if(vertices.indexOf(schema.edges[i].destination) == -1) {
                    vertices.push(schema.edges[i].destination);
                }
            }
        }

        schemaVertices = vertices;
    }

    schemaService.getEntityProperties = function(entity) {
        if(Object.keys(schema.entities[entity].properties).length) {
            return schema.entities[entity].properties;
        }
        return undefined;
    }

    schemaService.getEdgeProperties = function(edge) {
        if(Object.keys(schema.edges[edge].properties).length) {
            return schema.edges[edge].properties;
        }
        return undefined;
    }

    schemaService.get();


    return schemaService;

}]);
