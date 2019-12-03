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

import { Serializable } from './serializable.interface';

export class UIMappingDetail implements Serializable<UIMappingDetail> {

    label: string;
    userInputType: string;
    parameterName: string;
    inputClass: string;
    currentValue: any;

    deserialize(input: any): UIMappingDetail {

        this.label = input.label;
        this.userInputType = input.userInputType;
        this.parameterName = input.parameterName;
        this.inputClass = input.inputClass;
        this.currentValue = input.currentValue;

        return this;
    }
}