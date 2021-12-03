export default data => {
    let updateFields = { acq_method: [ 'DVR Examiner' ], proc_method: [ 'DVR Examiner' ] }
    let updateIds = []

    //console.log( data )

    data.forEach( ( line, idx ) => {
        const value = data[ idx + 1 ]

        if ( line == 'Export Completed:' ) { updateFields.reportdate = value.split( ' ' )[0] }
        else if ( line == 'Output Formats:' ) { updateFields.proc_notes = value }
        else if ( line == 'Total Clips Exported:' ) { updateFields.proc_notes = `${ updateFields.proc_notes } (${ value } clips.)` }
        else if ( line == 'Estimated Export Size:' ) {
            updateFields.capacity = value.replace( /[^0-9\.]/g, '' )
            if ( value.toLowerCase().indexOf( 'mb' ) >= 0 ) { updateFields.unit = 'MB' }
            if ( value.toLowerCase().indexOf( 'gb' ) >= 0 ) { updateFields.unit = 'GB' }
            if ( value.toLowerCase().indexOf( 'tb' ) >= 0 ) { updateFields.unit = 'TB' }
        }
        else if ( line.startsWith( 'DVR Examiner' ) && value == 'Version:' ) {
            updateFields.acq_ver = data[ idx + 2 ]
            updateFields.proc_ver = data[ idx + 2 ]
        }
        else if ( line == 'Case Number:' ) { updateFields.crn = value }
        else if ( line == 'Examiner:' ) { updateFields.examiner = value }
    })

    return { updateFields, updateIds }
}
