import { default as determineFileSource } from './determiner.js'
import { default as parseGraykeyPdfReport } from './parseGraykeyPdfReport.js'
import { default as parseDvrExaminerPdfReport } from './parseDvrExaminerPdfReport.js'

export default file => {
    return new Promise( ( resolve, reject ) => {
        let reader = new FileReader()

        reader.onload = async function() {
            const typedarray = new Uint8Array( reader.result )

            const pdf = await pdfjsLib.getDocument( typedarray ).promise

            const concatPages = async total => {
                let textNodes = []

                const next = async n => {
                    const page = await pdf.getPage( n )
                    textNodes = [ ...textNodes, ...(await page.getTextContent()).items.map( node => node.str ).filter( text => text.trim() ) ]

                    if ( n < total ) await next( n + 1 )
                }

                await next( 1 )
                return textNodes
            }

            const text = await concatPages( pdf.numPages > 1 ? 2 : 1 )
            const source = determineFileSource( text, 'pdf' )

            if ( source == 'graykey' ) return resolve( parseGraykeyPdfReport( text ) )
            if ( source == 'dvr_examiner' ) return resolve( parseDvrExaminerPdfReport( text ) )

            reject()
        }

        reader.onerror = () => { reject( reader.error ) }

        reader.readAsArrayBuffer( file )
    })
}

