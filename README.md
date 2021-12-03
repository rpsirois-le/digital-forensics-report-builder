## Digital Forensics Report Builder

Version | 1.0.0
--- | ---
**Author** | Robert Sirois
**Company** | [Universes Games](https://universesgames.com)
**License** | Apache

## Download

These are packaged as standalone launchers - no need for installation.

[Windows]()

[macOS]()

[Linux]()

[Docker]()

### Install on a Synology NAS

1. Download Docker from "Add-on Packages"
2. Use the Docker app to create a new container from file
3. Launch the container and set port settings to `3001:whatever`
4. Website should now be accessible on the Synology IP address at port `whatever`
5. (Port 80 is the default HTTP port so you don't have to specify it in the URL.)

(image)

## Configure

Use the built-in configurator (link in bottom of web page) to manage the configuration JSON file. The JSON file must be edited in separate software such as Vim or Notepad++. If you're lazy like me you can also use a website like [jsonlint.com](https://jsonlint.com/).

The report template may also be downloaded/uploaded in the configurator.

## Supported Source Files

Simply drag and drop onto the software to auto-fill the form. Later files (if dropping multiple) will overwrite previous file values as they are processed.

Software | File Type | Notes
--- | --- | ---
Cellebrite Physical Analyzer | XML | Custom fields, "Device info" and "User accounts" artifacts only
Cellebrite Physical Analyzer | CSV | Export of artifact counts
DVR Examiner | PDF | Entire file
FTK Imager | TXT | Entire file (log file)
GrayKey | PDF | Entire file

## Report Variables

Reports are generated using the open source plan of [docxtemplater](https://docxtemplater.com/). Documentation and examples for building Microsoft Word templates are [here](https://docxtemplater.com/docs/tag-types/). Below are the variables sent to the templating engine. Keep in mind:

* Array variables must use the "loop" syntax
* Checkboxes may be rendered with a boolean variable and the following custom syntax: `{var | cb}` where `var` is the actual name of the variable.
* Don't forget you can use conditional blocks!

### General Computed Variables

Several variables are computed and included by default. Timezone is determined from browser locale. Not all variables are guaranteed to exist - it depends on what is available in the source file(s). The `_wia` suffix means the computed value starts with its indefinite article (a/an).

Field Name (Case Sensitive) | Variable | Purpose
--- | --- | ---
Today (long format) | `today` | MMMM Do, YYYY
Today (short format) | `todayShort` | M/D/YY
Year | `year` | YYYY
Now | `now` | HHmm
Singular Serial Number | `sn` | This takes the value of the first found 'Serial Number' in the identifiers array.
a/an Extraction Type | `acq_type_wia` | a/an `{acq_type}`
Extraction Type Definition | `acq_type_def` | Performs a lookup on `hidden.glossary` for term matching `acq_type` for the definition.
a/an Device Color | `dev_color_wia` | a/an `{dev_color}`
a/an Device Model Name | `dev_model_name_wia` | a/an `{dev_model_name}`
Lowercase Authorization | `auth_type_lower` | Lowercase `{auth_type}`
Return to Evidence Statement | `returnToEvidenceStatement` | Uses waiver value if `{auth_type}` is waiver or noWaiver if not.
Acquisition System | `acq_system` | Set to label for truthy acquisition method (except for photos).
Processing System | `proc_system` | Set to label for truthy processing method.

### Cellebrite XML

Export only "Device info" and "User accounts" artifacts with an XML report type.

The following custom fields are supported by configuring them in the *Case information* section of the report options:

(image)

Field Name (Case Sensitive) | Variable | Purpose
--- | --- | ---
Examiner name | `examiner` | Full name of examiner
Authorization | `auth_type` | Warrant, waiver, etc. selected from dropdown
Requester Name | `requester` | Name of person requesting the examination
Unit Name | `acq_unit_name` | Name of acquisition device (ie. Cellebrite Touch 2, GrayKey, etc.)
Extraction type | `extraction_type` | Logical, file system, etc. selected from dropdown
Case number | `crn` | Agency case number
Evidence number | `evid_num` | Evidence number of original item to be examined
Lab evidence number | `evid_num_lab` | Evidence number for data/photos produced from exam

Standard variables (not all will be present for every extraction):

Field Name | Variable | Purpose
--- | --- | ---
extractionType | `extractionType` | As reported by Cellerbite
UFED_PA_Version | `proc_ver` | Physical analyzer version
DeviceInfoUnitIdentifier | `cellebrite_ufed_sn` | UFED serial number
DeviceInfoUnitVersion | `cellebrite_ufed_ver` | UFED version
DeviceInfoDetectedManufacturer | `dev_make` | Device make as reported by Cellebrite
DeviceInfoDetectedModel | `dev_model_name` | Device model as reported by Cellebrite
DeviceInfoAndroidID | `android_id` | Android ID *(added to array of identifiers)*
DeviceInfoAppleID | `apple_id` | Apple ID *(added to array of identifiers)*
DeviceInfoAdvertisingID | `ad_id` | Advertising ID *(added to array of identifiers)*
IMEI | `imei` | IMEI *(added to array of identifiers)*
IMEI2 | `imei` | IMEI *(added to array of identifiers)*
DeviceInfoSerial | `sn` | Serial number *(added to array of identifiers)*
DeviceInfoDeviceName | `device_name` | User-defined name for device *(added to array of identifiers)*
DeviceInfoBluetoothDeviceAddress | `bt_mac` | Bluetooth MAC address *(added to array of identifiers)*
DeviceInfoStorageCapacity | `capacity`, `unit` | Device capacity and unit of volume
DeviceInfoWiFiMACAddress | `wifi_mac` | WiFi MAC address *(added to array of identifiers)*
DeviceInfoMACAddress | `mac` | Device MAC address *(added to array of identifiers)*
ICCID | `iccid` | SIM ICCID *(added to array of identifiers)*
IMSI | `imsi` | Device IMSI *(added to array of identifiers)*
MEID | `meid` | Device MEID *(added to array of identifiers)*
MSISDN | `msisdn` | Device MSISDN *(added to array of identifiers)*
DeviceInfoDetectedPhoneModel | `dev_model_name` | Device model as reported by Cellebrite

### Cellebrite CSV

This file is simply the exported artifact counts.

(image)

Variables:

Field Name (Case Sensitive) | Variable | Purpose
--- | --- | ---
Counts | `counts` | An array of all the artifact counts.

### DVR Examiner PDF

Use the primary report - not the hash report. Only the first page of the report will be parsed and the rest disregarded since the report can be lengthy and only the first page contains case data.

Variables:

Field Name | Variable | Purpose
--- | --- | ---
Export Completed: | `reportdate` | Report date
Output Formats: | `proc_notes` | Formats clips were exported in
Total Clips Exported: | `proc_notes` | Number of clips exported (appended to notes)
Estimated Export Size: | `capacity`, `unit` | Size of all exported data and unit of volume
DVR Examiner ... Version: | `acq_ver`, `proc_ver` | DVR Examiner version
Case Number: | `crn` | Case number
Examiner: | `examiner` | Examiner name

### FTK Imager TXT

The log file FTK writes after imaging which contains case information and hashes.

(image)

Variables:

Field Name | Variable | Purpose
--- | --- | ---
Created By AccessData® FTK® Imager | `acq_ver` | FTK version number
Case Number: | `crn` | User-defined case number
Unique description: | `dev_model_code` | User-defined field, right now it sets the model code
Examiner: | `examiner` | User defined examiner name
Notes: | `acq_notes` | User-defined acquisition notes
Case Number: | `crn` | Case number
Source data size: | `capacity`, `unit` | Size and unit of physical drive volume
Drive Model: | `dev_model_name` | Physical drive model name
Drive Serial Number: | `sn` | Physical drive serial number *(added to array of identifiers)*
MD5 checksum: | `acq_hash_type`, `acq_hash` | Image hash is MD5 and value of the hash

### GrayKey PDF

This is the only PDF report GrayKey exports along with the other files. The first and second pages are looked at for relevant case information.

(image)

Variables:

Field Name | Variable | Purpose
--- | --- | ---
GrayKey Software: OS Version: | `acq_ver` | GrayKey version
Report generation time: | `reportdate` | Report date
Model | `dev_model_name` | Model name as reported by GrayKey
Unique Device ID (UDID) | `udid` | Device UDID *(added to array of identifiers)*
Serial Number | `sn` | Serial number *(added to array of identifiers)*
Unique Chip ID (ECID) | `ecid` | Device ECID *(added to array of identifiers)*
WiFi MAC Address | `wifi_mac` | WiFi MAC address *(added to array of identifiers)*
Bluetooth MAC Address | `bt_mac` | Bluetooth MAC address *(added to array of identifiers)*
Phone Number | `msisdn` | Device phone number *(added to array of identifiers)*
IMEI | `imei` | Device IMEI *(added to array of identifiers)*
Owner Name | `owner` | User-defined owner name
Accounts | `email` | Account email address *(added to array of identifiers)*
Partial BFU Filesystem | `pfs_bfu` | Type of GrayKey extraction
Extraction size | `capacity`, `unit` | Size of extracted data and unit of volume


```
Copyright 2021 Robert Sirois and Universes Games

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```