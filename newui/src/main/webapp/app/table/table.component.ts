import { Component, OnInit, Injectable, ViewChild } from "@angular/core";
import { MatSort, MatTableDataSource } from "@angular/material";

import { EventsService } from "../dynamic-input/events.service";
import { ResultsService } from "../gaffer/results.service";
import { CommonService } from "../dynamic-input/common.service";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html"
})
@Injectable()
export class TableComponent implements OnInit {
  data = {
    results: new MatTableDataSource()
  };

  @ViewChild(MatSort) sort: MatSort;
  schema;

  constructor(
    private events: EventsService,
    private results: ResultsService,
    private common: CommonService
  ) {}

  /**
   * Fetches the results and subscribes to resultsUpdated events.
   */
  ngOnInit() {
    this.events.subscribe("resultsUpdated", () => this.onResultsUpdated);
    this.processResults(this.results.get());
  }

  // resultsByType = [];
  // filteredResults = [];
  // searchTerm = "";

  // pagination = { limit: 50, page: 1 };
  // sortType = undefined;

  /**
   * Cleans up the controller. Unsubscribes from resultsUpdated events and
   * caches table preferences.
   */
  onDestroy = function() {
    this.events.unsubscribe("resultsUpdated", this.onResultsUpdated);
    //this.cacheValues();
  };

  // updateFilteredResults = function() {
  //   this.data.results = [];
  //   for (let t in this.data.types) {
  //     if (this.data.types[t] in this.resultsByType) {
  //       for (let g in this.data.groups) {
  //         if (this.data.groups[g] in this.resultsByType[this.data.types[t]]) {
  //           this.data.results = this.data.results.concat(
  //             this.resultsByType[this.data.types[t]][this.data.groups[g]]
  //           );
  //           this.data.results.sort = this.sort;
  //         }
  //       }
  //     }
  //   }
  // };

  onResultsUpdated = function(res) {
    this.processResults(res);
  };

  processResults = function(resultsData) {
    this.data.results = resultsData;

    //Get all the different column names
    this.displayedColumns = new Set();
    this.data.results.forEach((item, index) => {
      
      let keys = Object.keys(item);
      for (let i in keys) {

        //If the key is class then strip the class name to the last part after the full stop
        let key = keys[i];
        if (key === 'class') {
          this.data.results[index][key] = this.data.results[index][key].split('.').pop();
        }

        //Get a set of all the different keys to show as columns
        this.displayedColumns.add(key);
      }
    });
    this.columnsToDisplay = this.displayedColumns;
  };

  // processElements = function(
  //   type,
  //   typePlural,
  //   idKeys,
  //   ids,
  //   groupByProperties,
  //   properties,
  //   resultsData
  // ) {
  //   if (
  //     resultsData[typePlural] &&
  //     Object.keys(resultsData[typePlural]).length > 0
  //   ) {
  //     this.resultsByType[type] = [];
  //     this.common.pushValuesIfUnique(idKeys, ids);
  //     for (let i in resultsData[typePlural]) {
  //       let element = resultsData[typePlural][i];
  //       if (element) {
  //         let result = {};
  //         for (let idIndex in idKeys) {
  //           let id = idKeys[idIndex];
  //           if ("SOURCE" === id && element.source === undefined) {
  //             result[id] = this.convertValue(id, element.vertex);
  //           } else {
  //             result[id] = this.convertValue(id, element[id.toLowerCase()]);
  //           }
  //         }
  //         result["result type"] = type;

  //         if (element.properties) {
  //           if (!(element.group in this.resultsByType[type])) {
  //             this.resultsByType[type][element.group] = [];

  //             let elementDef = this.schema[typePlural][element.group];
  //             if (elementDef && elementDef.properties) {
  //               if (elementDef.groupBy) {
  //                 for (let j in elementDef.groupBy) {
  //                   let propName = elementDef.groupBy[j];
  //                   let typeDef = this.schema.types[
  //                     elementDef.properties[propName]
  //                   ];
  //                   if (
  //                     typeDef &&
  //                     typeDef.description &&
  //                     !(propName in this.data.tooltips)
  //                   ) {
  //                     this.data.tooltips[propName] = typeDef.description;
  //                   }
  //                   this.common.pushValueIfUnique(propName, groupByProperties);
  //                 }
  //               }
  //               for (let propertyName in elementDef.properties) {
  //                 let typeDef =
  //                   this.schema.types[elementDef.properties[propertyName]];
  //                 if (
  //                   typeDef &&
  //                   typeDef.description &&
  //                   !(propertyName in this.data.tooltips)
  //                 ) {
  //                   this.data.tooltips[propertyName] = typeDef.description;
  //                 }
  //                 this.common.pushValueIfUnique(propertyName, properties);
  //               }
  //             }
  //           }
  //           for (let prop in element.properties) {
  //             this.common.pushValueIfUnique(prop, properties);
  //             result[prop] = this.convertValue(prop, element.properties[prop]);
  //           }
  //         }
  //         if (!(element.group in this.resultsByType[type])) {
  //           this.resultsByType[type][element.group] = [];
  //         }
  //         this.resultsByType[type][element.group].push(result);
  //       }
  //     }
  //   }
  // };

  // processOtherTypes = function(ids, properties, resultsData) {
  //   for (let i in resultsData.other) {
  //     let item = resultsData.other[i];
  //     if (item) {
  //       let result = { GROUP: "" };
  //       for (let key in item) {
  //         let value = this.convertValue(key, item[key]);
  //         if ("class" === key) {
  //           result["result type"] = item[key].split(".").pop();
  //           this.common.pushValueIfUnique("result type", ids);
  //         } else if ("vertex" === key) {
  //           result["SOURCE"] = value;
  //           this.common.pushValueIfUnique("SOURCE", ids);
  //         } else if (
  //           "source" === key ||
  //           "destination" === key ||
  //           "directed" === key ||
  //           "group" === key
  //         ) {
  //           let parsedKey = key.toUpperCase();
  //           result[parsedKey] = value;
  //           this.common.pushValueIfUnique(parsedKey, ids);
  //         } else if ("value" === key) {
  //           result[key] = value;
  //           this.common.pushValueIfUnique(key, ids);
  //         } else {
  //           result[key] = value;
  //           this.common.pushValueIfUnique(key, properties);
  //         }
  //       }
  //       if (!(result["result type"] in this.resultsByType)) {
  //         this.resultsByType[result["result type"]] = {};
  //       }
  //       if (!(result.GROUP in this.resultsByType[result["result type"]])) {
  //         this.resultsByType[result["result type"]][result.GROUP] = [];
  //       }
  //       this.resultsByType[result["result type"]][result.GROUP].push(result);
  //     }
  //   }
  // };

  // convertValue = function(name, value) {
  //   let parsedValue = value;
  //   if (parsedValue) {
  //     parsedValue = this.types.getShortValue(parsedValue);
  //     if (this.time.isTimeProperty(name)) {
  //       parsedValue = this.time.getDateString(name, parsedValue);
  //     }
  //   }
  //   return parsedValue;
  // };

  // download = function() {
  //   let mimeType = "data:text/csv;charset=utf-8";
  //   let data = this.csv.generate(this.filteredResults, this.data.columns);
  //   let fileName = "gaffer_results_" + Date.now() + ".csv";
  //   this.downloadData(fileName, data, mimeType);
  // };

  // downloadData = function(fileName, data, mimeType) {
  //   let downloadLink = document.createElement("a");
  //   downloadLink.href = URL.createObjectURL(
  //     new Blob([data], { type: mimeType })
  //   );
  //   downloadLink.download = fileName;
  //   document.body.appendChild(downloadLink);
  //   downloadLink.click();
  //   document.body.removeChild(downloadLink);
  //   URL.revokeObjectURL(downloadLink.href);
  // };

  // getValue = function() {
  //   if (!this.sortType) {
  //     return "";
  //   }

  //   if (this.common.startsWith(this.sortType, "-")) {
  //     return '-"' + this.sortType.substring(1) + '"';
  //   }

  //   return '"' + this.sortType + '"';
  // };

  // loadFromCache = function() {
  //   let cachedValues = this.table.getCachedValues();
  //   this.searchTerm = cachedValues.searchTerm;
  //   this.sortType = cachedValues.sortType;
  //   this.chart = cachedValues.chart;
  //   this.showVisualisation = cachedValues.showVisualisation;
  //   this.data.columns = cachedValues.columns;
  //   this.data.types = cachedValues.types;
  //   this.data.groups = cachedValues.groups;

  //   if (cachedValues.pagination) {
  //     this.pagination = cachedValues.pagination;
  //   }
  // };

  // cacheValues = function() {
  //   let cachedValues = {
  //     searchTerm: this.searchTerm,
  //     sortType: this.sortType,
  //     pagination: this.pagination,
  //     chart: this.chart,
  //     showVisualisation: this.showVisualisation,
  //     columns : null,
  //     types: null,
  //     groups: null,
  //   };

  //   if (
  //     this.data.columns &&
  //     this.data.allColumns &&
  //     this.data.columns.length < this.data.allColumns.length
  //   ) {
  //     cachedValues.columns = this.data.columns;
  //   }

  //   if (
  //     this.data.types &&
  //     this.data.allTypes &&
  //     this.data.types.length < this.data.allTypes.length
  //   ) {
  //     cachedValues.types = this.data.types;
  //   }

  //   if (
  //     this.data.groups &&
  //     this.data.allGroups &&
  //     this.data.groups.length < this.data.allGroups.length
  //   ) {
  //     cachedValues.groups = this.data.groups;
  //   }

  //   this.table.setCachedValues(cachedValues);
  // };
}