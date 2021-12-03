import { default as determineFileSource } from './determiner.js'
import { default as parseCellebriteXmlReport } from './parseCellebriteXmlReport.js'


export default file => {
    return new Promise( ( resolve, reject ) => {
        let reader = new FileReader()

        reader.onload = async function() {
            const data = parser.parse( reader.result, {
                ignoreAttributes: false
                , attributeNamePrefix: ''
                , textNodeName: 'text'
            })

            const source = determineFileSource( reader.result.split( '\n' ), 'xml' )

            if ( source == 'cellebrite' ) resolve( parseCellebriteXmlReport( data ) )

            reject()
        }

        reader.onerror = () => { reject( reader.error ) }

        reader.readAsText( file )
    })
}
