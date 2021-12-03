const { useEffect, useState } = React
const e = React.createElement

import { default as csvParser } from './parsers/csv.js'
import { default as pdfParser } from './parsers/pdf.js'
import { default as txtParser } from './parsers/txt.js'
import { default as xmlParser } from './parsers/xml.js'

export default function FileParser({ name, label, formData, setFormData, identifiers, setIdentifiers }) {
    const [ message, setMessage ] = useState([ 'is-info', false ])
    const [ filename, setFilename ] = useState( '' )
    
    const handleFile = async ev => {
        const file = ev.target.files[0]
        const { name, type, size } = file

        setFilename( name )

        //console.log( `GOT FILE: ${ name }, ${ type }, ${ size }` )

        if ( type == 'application/pdf' ) { return pdfParser( file ) }
        else if ( type == 'text/csv' ) { return csvParser( file ) }
        else if ( type == 'text/plain' ) { return txtParser( file ) }
        else if ( type == 'text/xml' || type == 'application/xml' ) { return xmlParser( file ) }
        else { return Promise.reject() }
    }

    useEffect( () => {
        document.body.addEventListener( 'dragover', ev => {
            ev.preventDefault()
            ev.stopPropagation()

            return () => document.body.removeEventListener( 'dragover', ev )
        }, [] )

        document.body.addEventListener( 'drop', async ev => {
            ev.preventDefault()
            ev.stopPropagation()

            const files = Array.from( ev.dataTransfer.files )

            setMessage([ 'is-info', `Processing ${ files.length } file${ files.length > 1 ? 's' : '' }...` ])

            Promise.allSettled( files.map( file => handleFile({ target: { files: [ file ] } }) ) ).then( promises => {
                let updates = { ...formData }
                let ids = [ ...identifiers ]
                let completeSuccess = true
                let failed = 0
                let messages = []

                promises.forEach( ( promise, idx ) => {
                    if ( promise.status != 'fulfilled' ) failed++
                    messages.push( e( 'li', {}, [ e( 'strong', {}, promise.status == 'fulfilled' ? 'Completed: ' : 'Failed: ' ), e( 'span', {}, files[idx].name ) ] ) )
                })

                let messageStyle = 'is-danger'

                if ( failed == 0 ) { messageStyle = 'is-success' }
                else if ( failed > 0 && failed < promises.length ) { messageStyle = 'is-warning' }

                setMessage([ messageStyle, e( 'div', {}, [ e( 'p', {}, 'Later files overwrite previous values.' ), e( 'ol', { style: { listStylePosition: 'inside' } }, messages ) ] ) ])

                promises.filter( promise => promise.status == 'fulfilled' ).map( promise => promise.value ).forEach( ({ updateFields, updateIds }) => {
                    // dumb hack for the checkboxes
                    if ( updateFields.devstate ) updateFields.devstate = [ ...updates.devstate, ...updateFields.devstate ]
                    if ( updateFields.acq_method ) updateFields.acq_method = [ ...updates.acq_method, ...updateFields.acq_method ]
                    if ( updateFields.proc_method ) updateFields.proc_method = [ ...updates.proc_method, ...updateFields.proc_method ]

                    updates = { ...updates, ...updateFields }
                    ids = [ ...ids, ...updateIds ]
                })

                setFormData( updates )
                setIdentifiers( ids )
            })

            return () => document.body.removeEventListener( 'drop', ev )
        }, [] )
    })

    return e( 'div', {}, [
        message[1] ? e( 'article', { className: `message ${ message[0] }` }, e( 'div', { className: 'message-body' }, message[1] ) ) : ''
        , e( 'div', { className: 'field' }, [
            e( 'div', { className: 'file has-name is-fullwidth' }, [
                e( 'label', { className: 'file-label' }, [
                    e( 'input', { className: 'file-input', type: 'file', name, onChange: handleFile } )
                    , e( 'span', { className: 'file-cta' }, [
                        e( 'span', { className: 'file-icon' }, [
                            e( 'i', { className: 'fas fa-upload' } )
                        ])
                        , e( 'span', { className: 'file-label' }, label )
                    ])
                    , e( 'span', { className: 'file-name' }, filename )
                ])
            ])
        ])
    ])
}
