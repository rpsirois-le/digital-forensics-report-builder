import { default as determineFileSource } from './determiner.js'
import { default as parseFtkImagerTxtReport } from './parseFtkImagerTxtReport.js'

export default file => {
    return new Promise( ( resolve, reject ) => {
        let reader = new FileReader()

        reader.onload = async function() {
            const text = reader.result.split( '\n' )
            const source = determineFileSource( text, 'txt' )

            if ( source == 'ftk_imager' ) return resolve( parseFtkImagerTxtReport( text ) )

            reject()
        }

        reader.onerror = () => { reject( reader.error ) }

        reader.readAsText( file )
    })
}
