import { default as determineFileSource } from './determiner.js'

export default file => {
    return new Promise( ( resolve, reject ) => {
        let reader = new FileReader()

        reader.onload = async function() {
            const source = determineFileSource( reader.result.split( '\n' ), 'csv' )

            reject()
        }

        reader.onerror = () => { reject( reader.error ) }

        reader.readAsText( file )
    })
}
