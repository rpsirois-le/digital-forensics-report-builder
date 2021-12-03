const { useEffect, useState } = React
const e = React.createElement

import config from '../config/config.json'

import Form from './form.js'
import Footer from './footer.js'

const App = props => {
    const [ loading, setLoading ] = useState( true )
    const [ templates, setTemplates ] = useState( [] )

    useEffect( () => {
        fetch( '/templates' )
        .then( res => {
            if ( !res.ok ) return setErrorMessage( 'There was a problem loading templates.' )

            res.json().then( data => {
                setTemplates( data.files )
                setLoading( false )
            })
        })
    }, [] )

    return e( 'div', {}, [
        e( 'div', { className: `modal ${ loading ? 'is-active' : '' }` }, [
            e( 'div', { className: 'modal-background' } )
            , e( 'div', { className: 'modal-content' }, e( 'figure', { className: 'image is-64x64 container' }, e( 'img', { src: '/img/gear.png', alt: 'Loading...' } ) ) )
        ])
        , e( 'section', { className: 'section' }, [
            e( 'h1', { className: 'title' }, 'DFU Report Builder' )
            , e( 'h2', { className: 'subtitle' }, 'Drop source files on this window to autopopulate data entry form.' )
            , e( 'div', { className: 'container' }, e( Form, { templates, config } ) )
        ])
        , e( Footer )
    ])
}

ReactDOM.render( React.createElement( App ), document.getElementById( 'root' ) )
