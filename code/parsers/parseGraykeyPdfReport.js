export default data => {
    let updateFields = { acq_method: [ 'GrayKey' ] }
    let updateIds = []

    data.forEach( ( line, idx ) => {
        const value = data[ idx + 1 ]

        if ( line.startsWith( 'GrayKey Software: OS Version:' ) ) { updateFields.acq_ver = line.split( ',' )[0].replace( /[^0-9\.]/g, '' ) }
        else if ( line.startsWith( 'Report generation time:' ) ) { updateFields.reportdate = line.split( ' ' )[3] }
        else if ( line == 'Model' ) { updateFields.dev_model_name = value }
        else if ( line == 'Unique Device ID (UDID)' ) { updateIds.push({ type: 'UDID', value }) }
        else if ( line == 'Serial Number' ) { updateIds.push({ type: 'Serial Number', value }) }
        else if ( line == 'Unique Chip ID (ECID)' ) { updateIds.push({ type: 'ECID', value }) }
        else if ( line == 'WiFi MAC Address' ) { updateIds.push({ type: 'WiFi MAC', value }) }
        else if ( line == 'Bluetooth MAC Address' ) { updateIds.push({ type: 'Bluetooth MAC', value }) }
        else if ( line == 'Phone Number' ) { updateIds.push({ type: 'MSISDN', value }) }
        else if ( line == 'IMEI' ) { updateIds.push({ type: 'IMEI', value }) }
        else if ( line == 'Owner Name' ) { updateFields.owner = value }
        else if ( line == 'Accounts' ) { updateIds.push({ type: 'Email Address', value }) }
        else if ( line == 'Extraction Result Summary' ) {
            let mapped

            if ( value == 'Partial BFU Filesystem' ) { mapped = 'Partial Filesystem (BFU)' }

            updateFields.acq_type = mapped
        }
        else if ( line == 'Extraction size' ) {
            updateFields.capacity = value.split( '(' )[0].replace( /[^0-9\.]/g, '' )
            if ( value.toLowerCase().indexOf( 'mb' ) >= 0 ) { updateFields.unit = 'MB' }
            if ( value.toLowerCase().indexOf( 'gb' ) >= 0 ) { updateFields.unit = 'GB' }
            if ( value.toLowerCase().indexOf( 'tb' ) >= 0 ) { updateFields.unit = 'TB' }
        }
    })

    return { updateFields, updateIds }
}
