import { default as constants } from './constants.js'

export default function determineFileSource( lines, type ) {
    let n = 0
    const parsers = constants.INDICATORS.filter( parser => parser.type == type )

    function next( linenum ) {
        if ( linenum >= lines.length ) return false

        const line = lines[linenum]
        let match = false

        parsers.forEach( indicator => {
            if ( line.match( indicator.regex ) ) match = indicator.source
        })

        if ( match ) return match

        return next( n++ )
    }

    return next( n )
}
