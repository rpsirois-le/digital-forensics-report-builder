const p = require( 'path' )
const fs = require( 'fs' )
const stream = require( 'stream' )

const resourcePath = process.resourcesPath || __dirname

console.log( resourcePath )

const express = require( 'express' )
const fileUpload = require( 'express-fileupload' )
const { body, param, validationResult } = require( 'express-validator' )

const app = express()
app.use( express.static( p.resolve( resourcePath, './public' ) ) )
app.use( express.json() )
app.use( fileUpload() )

const moment = require( 'moment-timezone' )
const { v4: uuidv4 } = require( 'uuid' )
const Zip = require( 'pizzip' )
const Docx = require( 'docxtemplater' )
const expressions = require( 'angular-expressions' )

let config = require( p.resolve( resourcePath, './config/config.json' ) )

expressions.filters.cb = bool => {
    return ( bool == 'true' ) ? '☒' : '☐'
}

const parser = tag => {
    if ( tag === '.' ) return { get: s => s }

    const expr = expressions.compile( tag.replace( /(’|“|”|‘)/g, "'" ) )

    return { get: s => expr( s ) }
}

const generateReport = async ( filename, data ) => {
    return new Promise( async ( res, rej ) => {
        try {
            const tpl = await fs.promises.readFile( p.join( resourcePath, `./docx/${ data.template }` ), 'binary' )

            let zip = new Zip( tpl )
            let doc = new Docx().loadZip( zip ).setOptions({
                parser
                , linebreaks: true
            })

            // format timestamps

            if ( data.reportdate ) data.reportdate = moment( data.reportdate ).format( config.general.reportdate_fmt )
            if ( data.evid_receivedate ) data.evid_receivedate = moment( data.evid_receivedate ).format( config.evidence.evid_receivedate_fmt )
            if ( data.exam_complete ) data.exam_complete = moment( data.exam_complete ).format( config.evidence.exam_complete_fmt )

            const dt = moment().tz( data.localized_timezone )

            data.today = dt.format( 'MMMM Do, YYYY' )
            data.todayShort = dt.format( 'M/D/YY' )
            data.year = dt.format( 'YYYY' )
            data.now = dt.format( 'HHmm' )

            // add extra derived fields

            data.sn = data.identifiers.filter( id => id.type == 'Serial Number' )[0]
            if ( data.sn ) data.sn = data.sn.value

            data.acq_type_wia = `${ /^[aeiouAEIOU].*/.test( data.acq_type ) ? 'an' : 'a' } ${ data.acq_type }`

            const extractionTypeDefinition = config.hidden.glossary.filter( item => item.term == data.acq_type )[0]

            if ( extractionTypeDefinition ) data.acq_type_def = extractionTypeDefinition.definition

            data.dev_color_wia = `${ /^[aeiouAEIOU].*/.test( data.dev_color ) ? 'an' : 'a' } ${ data.dev_color }`
            data.dev_model_wia = `${ /^[aeiouAEIOU].*/.test( data.dev_model_name ) ? 'an' : 'a' } ${ data.dev_model_name }`
            if ( data.auth_type ) data.auth_type_lower = data.auth_type.toLowerCase()
            data.returnToEvidenceStatement = data.auth_type == 'Waiver' ? config.hidden.returnToEvidenceStatement_waiver.replace( '{requester}', data.requester ) : config.hidden.returnToEvidenceStatement_noWaiver

            config.acquisition.methods.forEach( method => {
                if ( data[method.value] && method.value != 'Photos' ) { data.acq_system = method.value }
            })

            config.processing.methods.forEach( method => {
                if ( data[method.value] ) data.proc_system = method.value
            })

            // save the password to disk

            if ( data.acq_pw ) {
                try {
                    // might need to do this in sqlite if the file gets too big
                    const pwPath = p.join( resourcePath, 'passwords', 'passwords.txt' )
                    const file = await fs.promises.readFile( pwPath, 'utf8' )
                    let newFile = `${ file }`

                    if ( file.indexOf( data.acq_pw ) < 0 ) newFile += `\n${ data.acq_pw }`

                    await fs.promises.writeFile( pwPath, newFile )
                } catch( err ) {
                    if ( config.devMode ) console.log( `Failed to append passcode: ${ data.acq_pw }\n`, err )
                }

                if ( data.owner ) {
                    try {
                        const pwByOwnerPath = p.join( resourcePath, 'passwords', 'passwords-by-owner.txt' )
                        const file = await fs.promises.readFile( pwByOwnerPath, 'utf8' )
                        let foundOwner = false
                        let lines = file.split( '\n' ).map( line => {
                            const parts = line.split( '\t' )

                            if ( parts[0].toLowerCase() == data.owner.toLowerCase() ) {
                                foundOwner = true
                                return `${ line }\t${ data.acq_pw }`
                            }

                            return line
                        })

                        if ( !foundOwner ) lines.push( `${ data.owner }\t${ data.acq_pw }` )

                        await fs.promises.writeFile( pwByOwnerPath, lines.join( '\n' ) )
                    } catch( err ) {
                        if ( config.devMode ) console.log( `Failed to append passcode by owner: ${ data.owner } :: ${ data.acq_pw }\n`, err )
                    }
                }
            }

            // generate the docx document

            doc.setData( data )

            try {
                doc.render()
            } catch ( err ) {
                return rej( err )
            }

            const buffer = doc.getZip().generate({
                type: 'nodebuffer'
            })

            const token = uuidv4()
            const outputDir = p.join( resourcePath, 'output' )

            try {
                const outputStats = await fs.promises.stat( outputDir )
            } catch ( err ) {
                await fs.promises.mkdir( outputDir )
            }

            await fs.promises.writeFile( p.join( outputDir, `${ token }.docx` ), buffer )

            return res( token )
        } catch ( err ) {
            return rej( err )
        }
    })
}

app.get( '/configure', ( req, res ) => { res.sendFile( p.join( resourcePath, 'public/configure.html' ) ) } )

app.get( '/configure/current', ( req, res ) => { res.download( p.join( resourcePath, 'config/config.json' ) ) } )

app.get( '/configure/default', ( req, res ) => { res.download( p.join( resourcePath, 'config/default.json' ) ) } )

app.post(
    '/configure/load'
    , async ( req, res ) => {
        config = req.body
        fs.writeFile( p.join( resourcePath, 'config/config.json' ), JSON.stringify( req.body, null, 4 ), err => {
            if ( err ) return res.status( 400 ).json({ error: 'Failed to write configuration file.' })

            return res.status( 200 ).json({ error: false })
        })
    }
)

app.get( '/passwords', ( req, res ) => { res.download( p.join( resourcePath, 'passwords/passwords.txt' ) ) } )

app.get( '/passwords/byowner', ( req, res ) => { res.download( p.join( resourcePath, 'passwords/passwords-by-owner.txt' ) ) } )

app.get( '/templates', ( req, res ) => {
    fs.readdir( p.join( resourcePath, './docx' ), ( err, files ) => {
        if ( err ) return res.status( 500 ).json({ error: err })

        res.status( 200 ).json({ err, files: files.filter( file => p.extname( file ).toLowerCase() == '.docx' ) })
    })
})

app.get( '/templates/remove/:docname', ( req, res ) => {
    fs.unlink( p.join( resourcePath, 'docx', req.params.docname ), err => {
        if ( err ) return res.status( 500 ).json({ error: err })

        res.status( 200 ).json({ error: false })
    })
})

app.post(
    '/templates/load'
    , async ( req, res ) => {
        const file = req.files.file

        fs.writeFile( p.join( resourcePath, `docx/${ file.name }` ), file.data, err => {
            if ( err ) return res.status( 400 ).json({ error: 'Failed to write template file.' })

            return res.status( 200 ).json({ error: false })
        })
    }
)

app.post(
    '/generate'
    , body( 'crn' ).isLength({ min: 1 }).withMessage( `"crn" is required.` )
    , body( 'localized_timezone' ).isLength({ min: 1 }).withMessage( `"localized_timezone" is required.` )
    , async ( req, res  ) => {
        const validationErrors = validationResult( req )

        if ( !validationErrors.isEmpty() ) {
            return res.status( 400 ).json({
                errors: validationErrors.array()
            })
        }

        try {
            const token = await generateReport( 'filename goes here?', req.body )

            res.status( 200 ).json({
                error: false
                , token
            })
        } catch ( err ) {
            if ( config.devMode ) console.log( 'err from gen report', err )
            res.status( 500 ).json({ error: err })
        }
    }
)

app.get(
    '/download/:token'
    , param( 'token' ).isUUID( 4 ).withMessage( 'Download token must be a valid UUID (v4)' )
    , ( req, res ) => {
        const path = p.join( resourcePath, 'output', `${ req.params.token }.docx` )

        res.download( path, () => {
            setTimeout( () => {
                fs.unlink( path, err => {
                    if ( err ) return console.error( err )
                })
            }, 1000 )
        })
    }
)

 
const port = process.env.PORT || 3001

app.listen( port, () => {
    console.log( `[Report Builder] Listening on port ${ port }.` )

    const { app, BrowserWindow, screen } = require( 'electron' )

    const createWindow = () => {
        const win = new BrowserWindow({
            show: false
            //, width: screen.width
            //, height: screen.height
            , webPreferences: {
                preload: 'preload.js'
            }
        })

        win.maximize()
        win.show()
        win.loadURL( 'http://localhost:3001/' )
        //win.openDevTools()
    }


    app.whenReady().then( () => {
        createWindow()

        app.on( 'activate', () => {
            if ( BrowserWindow.getAllWindows().length === 0 ) createWindow()
        } )
    } )

    app.on( 'window-all-closed', () => {
        if ( process.platform !== 'darwin' ) app.quit()
    } )
})
