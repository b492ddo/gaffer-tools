/*
 * Copyright 2017-2018 Crown Copyright
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

angular.module('app').component('settingsView', settingsView())

function settingsView() {

    return {
        templateUrl: 'app/settings/settings.html',
        controller: SettingsController,
        controllerAs: 'ctrl'
    }
}

function SettingsController(settings, schema, operationService, events, config) {
    var vm = this;

    vm.saveClearChainCheckbox = function() {
        settings.setClearChainCheckbox(!vm.clearChainCheckbox);
        vm.clearChainCheckbox = !vm.clearChainCheckbox;
    }

    vm.$onInit = function() {
        vm.showOptions = false;
        vm.resultLimit = settings.getResultLimit();
        vm.clearChainCheckbox = settings.getClearChainCheckbox();
        config.get().then(function(conf) {
            vm.showOptions = (conf.operationOptions !== undefined || conf.operationOptionKeys !== undefined);
        });
    }

    vm.updateResultLimit = function() {
        if (vm.querySettingsForm.resultLimit.$valid) {
            settings.setResultLimit(vm.resultLimit);
        }
    }

    vm.updateSchema = function() {
        events.broadcast('onPreExecute', []);
        schema.update();
        operationService.reloadOperations(true);
    }
}
