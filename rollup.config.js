import { nodeResolve } from '@rollup/plugin-node-resolve'
import ru_replace from '@rollup/plugin-replace'
import ru_commonjs from '@rollup/plugin-commonjs'
import ru_json from '@rollup/plugin-json'

const configs = []

function add( name ) {
    configs.push({
        input: `./code/${ name }.js`
        , output: {
            file: `./public/dist/${ name }.js`
            , name
            , format: 'iife'
            , sourcemap: true
        }
        , plugins: [
            nodeResolve({
                extensions: [ '.js' ]
            })
            , ru_replace({
                'process.env.NODE_ENV': JSON.stringify( 'development' )
            }),
            , ru_commonjs()
            , ru_json()
        ]
    })
}

add( 'app' )
add( 'configure' )

export default configs
