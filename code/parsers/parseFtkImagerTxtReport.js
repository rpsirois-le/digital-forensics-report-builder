export default data => {
    let updateFields = { acq_method: [ 'AccessData FTK Imager' ] }
    let updateIds = []

    //console.log( data )

    data.forEach( ( line, idx ) => {
        if ( line.startsWith( 'Created By AccessData® FTK® Imager' ) ) { updateFields.acq_ver = line.split( 'Imager' )[1].trim() }
        else if ( line.startsWith( 'Case Number:' ) ) { updateFields.crn = line.split( ':' )[1].trim() }
        else if ( line.startsWith( 'Evidence Number:' ) ) { updateFields.evid_num = line.split( ':' )[1].trim() }
        else if ( line.startsWith( 'Unique description:' ) ) { updateFields.dev_model_code = line.split( ':' )[1].trim() }
        else if ( line.startsWith( 'Examiner:' ) ) { updateFields.examiner = line.split( ':' )[1].trim() }
        else if ( line.startsWith( 'Notes:' ) ) { updateFields.acq_notes = line.split( ':' )[1].trim() }
        else if ( line.trim().startsWith( 'Source data size:' )  ) {
            updateFields.capacity = line.replace( /[^0-9\.]/g, '' )
            if ( line.toLowerCase().indexOf( 'mb' ) >= 0 ) { updateFields.unit = 'MB' }
            if ( line.toLowerCase().indexOf( 'gb' ) >= 0 ) { updateFields.unit = 'GB' }
            if ( line.toLowerCase().indexOf( 'tb' ) >= 0 ) { updateFields.unit = 'TB' }
        }
        else if ( line.trim().startsWith( 'Drive Model:' ) ) { updateFields.dev_model_name = line.split( ':' )[1].trim() }
        else if ( line.trim().startsWith( 'Drive Serial Number:' ) ) { updateIds.push({ type: 'Serial Number', value: line.split( ':' )[1].trim() }) }
        else if ( line.trim().startsWith( 'MD5 checksum:' ) ) {
            updateFields.acq_hash_type = 'MD5'
            updateFields.acq_hash = line.split( ':' )[1].trim()
        }
    } )

    return { updateFields, updateIds }
}
