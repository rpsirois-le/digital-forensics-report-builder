const { useState } = React
const e = React.createElement

import FileParser from './fileparser.js'
import Input from './input.js'

const Form = props => {
    const [ message, setMessage ] = useState([ 'is-info', false ])
    const { templates, config } = props
    const [ formData, setFormData ] = useState({
        // application
        localized_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        , template: templates[0]
        // general
        , examiner: config.general.examiner
        , unit: config.general.unit
        , auth_type: config.general.auth_type
        // evidence
        , exam_complete: (new Date()).toISOString().split( 'T' )[0]
        , evid_receivefrom: config.evidence.evid_receivefrom
        // device information
        , defects: config.device_information.defects
        // device state
        , devstate: []
        // acquisition
        , acq_method: []
        // processing
        , proc_method: []
    })
    const [ identifiers, setIdentifiers ] = useState( [] )
    const [ submitting, setSubmitting ] = useState( false )

    const onSubmit = event => {
        event.preventDefault()

        setSubmitting( true )

        console.log( formData )

        if ( !formData.template ) formData.template = templates[0]
        
        fetch( '/generate', {
            method: 'post'
            , headers: { 'Content-Type': 'application/json' }
            , body: JSON.stringify({
                ...formData
                , identifiers
            })
        })
        .then( res => {
            if ( res.status == 200 ) {
                res.json().then( data => {
                    if ( data.errors ) return console.log( 'Error in OK response:', data.errors )

                    window.open( `/download/${ data.token }`, '_blank' )

                    setMessage([ 'is-success', `Report ${ data.token } complete!` ])
                })
            } else if ( res.status == 400 ) {
                res.json().then( data => {
                    console.log( 'Errors in request:', data.errors )
                    setMessage([ 'is-danger', `Error building report: ${ data.errors }` ])
                })
            } else {
                console.log( 'Problem with request to generate report.' )
                setMessage([ 'is-danger', 'Server error.' ])
            }

            setSubmitting( false )
        })
        .catch( err => {
            console.log( err )
            setMessage([ 'is-danger', `Unknown error: ${ err }` ])

            setSubmitting( false )
        })
    }

    const handleIdentifierTypeChange = ( ev, identifier, idx ) => {
        let copied = [ ...identifiers ]

        copied[idx] = { ...identifier, type: ev.target.value }
        setIdentifiers( copied )
    }

    const handleIdentifierValueChange = ( ev, identifier, idx ) => {
        let copied = [ ...identifiers ]

        copied[idx] = { ...identifier, value: ev.target.value }
        setIdentifiers( copied )
    }

    const handleDeleteIdentifier = ( ev, identifier ) => {
        setIdentifiers( identifiers.filter( id => id != identifier ) )
    }

    const handleAddIdentifier = ev => {
        setIdentifiers( [ ...identifiers, { type: 'default', value: '' } ] )
    }

    const onChange = event => {
        let { name, type, value, checked } = event.target
        let newValue = value

        if ( type == 'checkbox' ) {
            // convert checkbox selections into arrays for their "groups"
            if ( name.endsWith( '[]' ) ) {
                name = name.replace( /[\[\]]/g, '' )

                if ( !formData.hasOwnProperty( name ) ) formData[name] = []

                newValue = [ ...formData[name] ]

                checked
                    ? newValue.push( value )
                    : newValue = newValue.filter( ea => ea != value )
            } else {
                value = checked
            }
        }

        setFormData({
            ...formData
            , [name]: newValue
        })
    }

    const renderCb = cb => {
        return e( 'div', {}, [
            e( 'label', { className: 'checkbox' }, [
                e( 'input', { type: 'checkbox', name: `${ cb.group }[]`, value: cb.value, checked: cb.group ? formData[cb.group].indexOf( cb.value ) >= 0 : formData[cb.value], onChange } )
                , cb.label
            ])
            , e( 'br' )
        ])
    }

    return e( 'form', { className: 'form', onSubmit }, [
        e( FileParser, { name: 'fileinput', label: 'Upload Source Information', formData, setFormData, identifiers, setIdentifiers } )
        , e( 'div', { className: 'columns' }, [
            e( 'div', { className: 'column' }, [
                e( 'label', { className: 'label' }, 'Document Template' )
                , e( 'div', { className: 'select' }, e( 'select', { name: 'template', value: formData['template'] || templates[0], onChange }, templates.map( opt => e( 'option', { value: opt }, opt ) ) ) )
            ])
        ])
        , e( 'p', { className: 'title is-3' }, 'General' )
        , e( 'div', { className: 'columns' }, [
            e( 'div', { className: 'column' }, [
                e( Input, { name: 'crn', type: 'text', label: 'Case Number', value: (formData['crn'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column' }, [
                e( Input, { name: 'oa_crn', type: 'text', label: 'Other Agency Case Number', value: (formData['oa_crn'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column' }, [
                e( Input, { name: 'examiner', type: 'text', label: 'Examiner', value: (formData['examiner'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column' }, [
                e( Input, { name: 'reportdate', type: 'date', label: 'Date of Report', value: (formData['reportdate'] || ''), onChange } )
            ])
        ])
        , e( 'div', { className: 'columns' }, [
            e( 'div', { className: 'column is-3' }, [
                e( Input, { name: 'capacity', type: 'number', label: 'Capacity', value: (formData['capacity'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column is-3' }, [
                e( 'label', { className: 'label' }, 'Capacity Unit' )
                , e( 'div', { className: 'select' }, e( 'select', { name: 'unit', value: (formData['unit'] || 'mb'), onChange }, config.general.units.map( opt => e( 'option', { value: opt.value }, opt.label ) ) ) )
            ])
        ])
        , e( 'div', { className: 'columns' }, [
            e( 'div', { className: 'column is-3' }, [
                e( 'label', { className: 'label' }, 'Authorization Type' )
                , e( 'div', { className: 'select' }, e( 'select', { name: 'auth_type', value: (formData['auth_type'] || 'waiver'), onChange }, config.general.auth_types.map( opt => e( 'option', { value: opt.value }, opt.label ) ) ) )
            ])
            , e( 'div', { className: 'column is-3' }, [
                e( Input, { name: 'auth_ref', type: 'text', label: 'Authorization Reference', value: (formData['auth_ref'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column is-6' }, [
                e( Input, { name: 'owner', type: 'text', label: 'Owner Name', value: (formData['owner'] || ''), onChange } )
            ])
        ])
        , e( 'p', { className: 'title is-3' }, 'Evidence' )
        , e( 'div', { className: 'columns' }, [
            e( 'div', { className: 'column is-3' }, [
                e( Input, { name: 'requester', type: 'text', label: 'Requester', value: (formData['requester'] || ''), onChange } )
            ])
        ])
        , e( 'div', { className: 'columns' }, [
            e( 'div', { className: 'column is-3' }, [
                e( Input, { name: 'evid_num', type: 'text', label: 'Evidence Number', value: (formData['evid_num'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column is-3' }, [
                e( Input, { name: 'evid_receivedate', type: 'date', label: 'Date Evidence Received', value: (formData['evid_receivedate'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column is-3' }, [
                e( Input, { name: 'evid_receivefrom', type: 'text', label: 'Evidence Received From', value: (formData['evid_receivefrom'] || ''), onChange } )
            ])
        ])
        , e( 'div', { className: 'columns' }, [
            e( 'div', { className: 'column is-3' }, [
                e( Input, { name: 'evid_labnum', type: 'text', label: 'Lab Evidence Number', value: (formData['evid_labnum'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column is-3' }, [
                e( Input, { name: 'exam_complete', type: 'date', label: 'Exam Completed Date', value: (formData['exam_complete'] || ''), onChange } )
            ])
        ])
        , e( 'p', { className: 'title is-3' }, 'Device Information' )
        , e( 'div', { className: 'columns' }, [
            e( 'div', { className: 'column' }, [
                e( Input, { name: 'dev_make', type: 'text', label: 'Make', value: (formData['dev_make'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column' }, [
                e( Input, { name: 'dev_model_name', type: 'text', label: 'Model Name', value: (formData['dev_model_name'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column' }, [
                e( Input, { name: 'dev_model_code', type: 'text', label: 'Model Code', value: (formData['dev_model_code'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column' }, [
                e( Input, { name: 'dev_color', type: 'text', label: 'Color', value: (formData['dev_color'] || ''), onChange } )
            ])
        ])
        , e( 'div', { className: 'columns' }, [
            e( 'div', { className: 'column' }, [
                e( Input, { name: 'defects', type: 'text', label: 'Defects/Comments', value: (formData['defects'] || ''), onChange } )
            ])
        ])
        , e( 'div', {}, identifiers.map( ( identifier, idx ) => {
            return e( 'div', { className: 'box' }, [
                e( 'div', { className: 'columns' }, [
                    e( 'div', { className: 'column is-2' }, [
                        e( 'strong', { className: 'title is-4' }, `Identifier ${ idx }` )
                    ])
                    , e( 'div', { className: 'column is-2' }, [
                        e( 'label', { className: 'label' }, 'Identifier Type' )
                        , e( 'div', { className: 'select' }, e( 'select', { name: `dev_id${ idx }_type`, value: identifier.type, onChange: ev => handleIdentifierTypeChange( ev, identifier, idx ) }, config.identifiers.types.map( opt => e( 'option', { value: opt.value }, opt.label ) ) ) )
                    ])
                    , e( 'div', { className: 'column is-4' }, [
                        e( Input, { name: `dev_id${ idx }_val`, type: 'text', label: 'Identifier', value: identifier.value, onChange: ev => handleIdentifierValueChange( ev, identifier, idx ) } )
                    ])
                    , e( 'div', { className: 'column is-4' }, [
                        e( 'button', { className: 'button is-danger', type: 'button', onClick: ev => handleDeleteIdentifier( ev, identifier ) }, [
                            e( 'span', { className: 'icon' }, e( 'i', { className: 'fa-solid fa-trash fa-lg' } ) )
                        ])
                    ])
                ])
            ])
        }) )
        , e( 'div', {}, [
            e( 'button', { className: 'button is-primary', type: 'button', onClick: handleAddIdentifier }, [
                e( 'span', { className: 'icon' }, e( 'i', { className: 'fa-solid fa-plus fa-lg' } ) )
                , e( 'span', {}, 'Add Identifier' )
            ])
        ])
        , e( 'p', { className: 'title is-3' }, 'Device State' )
        , e( 'div', { className: 'columns' }, e( 'div', { className: 'column is-3' }, config.device_state.states.map( renderCb ) ) )
        , e( 'div', { className: 'columns' }, [
            , e( 'div', { className: 'column is-4' }, [
                e( Input, { name: 'devstate_locktype', type: 'text', label: 'Lock Type', value: (formData['devstate_locktype'] || ''), onChange } )
            ])
        ])
        , e( 'p', { className: 'title is-3' }, 'Acquisition' )
        , e( 'div', { className: 'columns' }, [ 0, 1, 2, 3, 4, 5, 6 ].map( colNum => e( 'div', { className: 'column is-narrow' }, config.acquisition.methods.filter( method => method.col == colNum ).map( renderCb ) ) ) )
        , e( 'div', { className: 'columns' }, [
            e( 'div', { className: 'column is-narrow' }, [
                e( 'label', { className: 'label' }, 'Acquisition Type' )
                , e( 'div', { className: 'select' }, e( 'select', { name: `acq_type`, value: formData['acq_type'], onChange }, config.acquisition.types.map( opt => e( 'option', { value: opt.value }, opt.label ) ) ) )
            ])
            , e( 'div', { className: 'column is-4' }, [
                e( Input, { name: 'acq_notes', type: 'text', label: 'Acquisition Note', value: (formData['acq_notes'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column is-3' }, [
                e( Input, { name: 'acq_ver', type: 'text', label: 'Version', value: (formData['acq_ver'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column is-3' }, [
                e( Input, { name: 'acq_pw', type: 'text', label: 'Passcode', value: (formData['acq_pw'] || ''), onChange } )
            ])
        ])
        , e( 'div', { className: 'columns' }, [
            e( 'div', { className: 'column is-narrow' }, [
                e( 'label', { className: 'label' }, 'Hash Algorithm' )
                , e( 'div', { className: 'select' }, e( 'select', { name: `acq_hash_type`, value: formData['acq_hash_type'], onChange }, config.acquisition.hash_types.map( opt => e( 'option', { value: opt.value }, opt.label ) ) ) )
            ])
            , e( 'div', { className: 'column is-4' }, [
                e( Input, { name: 'acq_hash', type: 'text', label: 'Hash', value: (formData['acq_hash'] || ''), onChange } )
            ])
        ])
        , e( 'p', { className: 'title is-3' }, 'Processing' )
        , e( 'div', { className: 'columns' }, [ 0, 1, 2, 3, 4, 5, 6 ].map( colNum => e( 'div', { className: 'column is-narrow' }, config.processing.methods.filter( method => method.col == colNum ).map( renderCb ) ) ) )
        , e( 'div', { className: 'columns' }, [
            e( 'div', { className: 'column is-4' }, [
                e( Input, { name: 'proc_notes', type: 'text', label: 'Processing Note', value: (formData['proc_notes'] || ''), onChange } )
            ])
            , e( 'div', { className: 'column is-3' }, [
                e( Input, { name: 'proc_ver', type: 'text', label: 'Version', value: (formData['proc_ver'] || ''), onChange } )
            ])
        ])
        , e( 'div', {}, [
            e( 'button', { className: 'button is-primary', type: 'button' }, [
                e( 'span', { className: 'icon' }, e( 'i', { className: 'fa-solid fa-hard-drive fa-lg' } ) )
                , e( 'span', {}, 'Start Related Device Report' )
            ])
        ])
        , e( 'div', {}, [
            e( 'button', { type: 'submit', className: `button is-success ${ submitting ? 'is-loading' : '' }` }, [
                e( 'span', { className: 'icon' }, e( 'i', { className: 'fa-solid fa-file-word fa-lg' } ) )
                , e( 'span', {}, 'Generate Report' )
            ])
        ])
        , message[1] ? e( 'article', { className: `message ${ message[0] }` }, e( 'div', { className: 'message-body' }, message[1] ) ) : ''
    ])
}

export default Form
