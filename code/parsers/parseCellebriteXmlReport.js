export default data => {
    const { project } = data

    let updateFields = { proc_method: [ 'Cellebrite Physical Analyzer' ] }
    let updateIds = []

    //console.log( project )

    if ( project.extractionType == 'AdvancedLogical' ) updateFields.acq_type = 'Advanced Logical'

    // case information
    project.caseInformation.field.forEach( field => {
        if ( field.name == 'Examiner name' ) updateFields.examiner = field.text
        if ( field.name == 'Authorization' ) updateFields.auth_type = field.text
        if ( field.name == 'Requester Name' ) updateFields.requester = field.text
        if ( field.name == 'Unit name' ) updateFields.acq_unit_name = field.text
        if ( field.name == 'Extraction type' ) updateFields.extraction_type = field.text
        if ( field.name == 'Case number' ) updateFields.crn = field.text
        if ( field.name == 'Evidence number' ) updateFields.evid_num = field.text
        if ( field.name == 'Lab evidence number' ) updateFields.evid_num_lab = field.text
    })
    // metadata additional fields
    project.metadata.forEach( metadata => {
        // additional fields
        if ( metadata.section == 'Additional Fields' ) {
            metadata.item.forEach( field => {
                if ( field.name == 'UFED_PA_Version' ) updateFields.proc_ver = field.text
            })
        }
        // extraction data
        else if ( metadata.section == 'Extraction Data' ) {
            metadata.item.forEach( field => {
                if ( field.name == 'DeviceInfoUnitIdentifier' ) updateFields.cellebrite_ufed_sn = field.text
                if ( field.name == 'DeviceInfoUnitVersion' ) updateFields.cellebrite_ufed_ver = field.text
            })
        }
        // Device Info
        else if ( metadata.section == 'Device Info' ) {
            metadata.item.forEach( field => {
                if ( field.name == 'DeviceInfoDetectedManufacturer' ) { updateFields.dev_make = field.text }
                else if ( field.name == 'DeviceInfoDetectedModel' ) { updateFields.dev_model_name = field.text }
                else if ( field.name == 'DeviceInfoAndroidID' ) { updateIds.push({ type: 'Android ID', value: field.text }) }
                else if ( field.name == 'DeviceInfoAppleID' ) { updateIds.push({ type: 'Apple ID', value: field.text }) }
                else if ( field.name == 'DeviceInfoAdvertisingID' ) { updateIds.push({ type: 'Advertising ID', value: field.text }) }
                else if ( field.name == 'IMEI' ) { updateIds.push({ type: 'IMEI', value: field.text }) }
                else if ( field.name == 'IMEI2' ) { updateIds.push({ type: 'IMEI', value: field.text }) }
                else if ( field.name == 'DeviceInfoSerial' ) { updateIds.push({ type: 'Serial Number', value: field.text }) }
                else if ( field.name == 'DeviceInfoDeviceName' ) { updateIds.push({ type: 'Device Name', value: field.text }) }
                else if ( field.name == 'DeviceInfoBluetoothDeviceAddress' ) { updateIds.push({ type: 'Bluetooth MAC', value: field.text }) }
                else if ( field.name == 'DeviceInfoStorageCapacity' ) {
                    updateFields.capacity = field.text
                    updateFields.unit = 'B'
                }
                else if ( field.name == 'DeviceInfoWiFiMACAddress' ) { updateIds.push({ type: 'WiFi MAC', value: field.text }) }
                else if ( field.name == 'DeviceInfoMACAddress' ) { updateIds.push({ type: 'MAC', value: field.text }) }
                else if ( field.name == 'ICCID' ) { updateIds.push({ type: 'ICCID', value: field.text }) }
                else if ( field.name == 'IMSI' ) { updateIds.push({ type: 'IMSI', value: field.text }) }
                else if ( field.name == 'MEID' ) { updateIds.push({ type: 'MEID', value: field.text }) }
                else if ( field.name == 'MSISDN' ) { updateIds.push({ type: 'MSISDN', value: field.text }) }
                else if ( field.name == 'DeviceInfoDetectedPhoneModel' ) { updateFields.dev_model_name = field.text }
            })
        }
    })

    return { updateFields, updateIds }
}
