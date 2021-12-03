(function () {
    'use strict';

    const e$1 = React.createElement;

    function Footer() {
        return e$1( 'footer', { className: 'footer' }, [
            e$1( 'div', { className: 'content has-text-centered' }, [
                e$1( 'a', { href: '/' }, 'Home' )
                , e$1( 'span', {}, ' | ' )
                , e$1( 'a', { href: '/configure' }, 'Configure' )
                , e$1( 'br' )
                , e$1( 'a', { href: '/passwords' }, 'Password List' )
                , e$1( 'span', {}, ' | ' )
                , e$1( 'a', { href: '/passwords/byowner' }, 'Password by Owner' )
                , e$1( 'p', {}, '© 2021 Universes Games' )
            ])
        ])
    }

    const { useEffect, useState } = React;
    const e = React.createElement;

    const docxMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const Configurator = props => {
        const [ message, setMessage ] = useState([ 'is-info', false ]);
        const [ filename, setFilename ] = useState( '' );
        const [ templates, setTemplates ] = useState( [] );

        useEffect( () => {
            fetch( '/templates' )
            .then( res => {
                if ( !res.ok ) return setMessage([ 'is-danger', 'There was a problem loading templates.' ])

                res.json().then( data => setTemplates( data.files ) );
            });
        }, [] );

        const uploadDocxTpl = file => {
            return new Promise(( resolve, reject ) => {
                let data = new FormData();

                data.append( 'file', file );

                fetch( '/templates/load', {
                    method: 'post'
                    , body: data
                })
                .then( res => {
                    if ( res.status == 200 ) {
                        res.json().then( data => {
                            if ( data.error ) return reject( data.error )

                            return resolve( file )
                        });
                    } else {
                        reject( `Template ${ file.name } failed to upload (status ${ res.status }).` );
                    }
                })
                .catch( err => reject( `Template failed to upload: ${ err }.` ) );
            })
        };

        const uploadJsonConfig = file => {
            return new Promise(( resolve, reject ) => {
                fetch( '/configure/load', {
                    method: 'post'
                    , headers: { 'Content-Type': 'application/json' }
                    , body: file
                })
                .then( res => {
                    if ( res.status == 200 ) {
                        res.json().then( data => {
                            if ( data.error ) return reject( data.error )

                            return resolve( file )
                        });
                    } else {
                        reject( `JSON configuration failed to upload (status ${ res.status }).` );
                    }
                })
                .catch( err => reject( `JSON configuration failed to upload: ${ err }.` ) );
            })
        };

        const handleFile = async file => {
            const { name, type, size } = file;

            setFilename( name );

            if ( type != 'application/json' && type != docxMimeType ) return Promise.reject( 'Config files must be DOCX or JSON format.' )

            return type == 'application/json' ? uploadJsonConfig( file ) : uploadDocxTpl( file )
        };

        const onChange = async ev => {
            const file = ev.target.files[0];

            try {
                await handleFile( file );

                setMessage([ 'is-success', e( 'p', {}, `Configuration file ${ file.name } uploaded successfully.` ) ]);
            } catch( err ) {
                setMessage([ 'is-danger', e( 'p', {}, `Configuration file ${ file.name } failed to upload.` ) ]);
            }
        };

        const deleteTemplate = ( tpl, ev ) => {
            fetch( `/templates/remove/${ tpl }` )
            .then( res => {
                if ( !res.ok ) return setMessage([ 'is-danger', 'There was a problem deleting the template.' ])

                res.json().then( data => {
                    setTemplates( templates.filter( t => t != tpl ) );

                    return setMessage([ 'is-success', `${ tpl } deleted.` ])
                });
            });
        };
        
        useEffect( () => {
            document.body.addEventListener( 'dragover', ev => {
                ev.preventDefault();
                ev.stopPropagation();

                return () => document.body.removeEventListener( 'dragover', ev )
            }, [] );

            document.body.addEventListener( 'drop', async ev => {
                ev.preventDefault();
                ev.stopPropagation();

                const files = Array.from( ev.dataTransfer.files );

                setMessage([ 'is-info', `Processing ${ files.length } file${ files.length > 1 ? 's' : '' }...` ]);

                Promise.allSettled( files.map( file => handleFile( file ) ) ).then( promises => {
                    let newTpls = [ ...templates ];
                    let failed = 0;
                    let messages = [];

                    promises.forEach( ( promise, idx ) => {
                        const file = files[idx];

                        if ( promise.status == 'fulfilled' ) {
                            if ( file.type == docxMimeType ) newTpls.push( file.name );
                        } else {
                            failed++;
                        }

                        messages.push( e( 'li', {}, [ e( 'strong', {}, promise.status == 'fulfilled' ? 'Completed: ' : 'Failed: ' ), e( 'span', {}, file.name ) ] ) );
                    });

                    let style = 'is-danger';

                    if ( failed == 0 ) { style = 'is-success'; }
                    else if ( failed > 0 && failed < promises.length ) { style = 'is-warning'; }

                    setMessage([ style, e( 'div', {}, [ e( 'p', {}, 'Upload configuration files status:' ), e( 'ol', { style: { listStylePosition: 'inside' } }, messages ) ] ) ]);

                    setTemplates( newTpls );
                });

                return () => document.body.removeEventListener( 'drop', ev )
            }, [] );
        });

        return e( 'div', {}, [
            e( 'section', { className: 'section' }, [
                e( 'h1', { className: 'title' }, 'Report Builder - Configurator' )
                , e( 'h2', { className: 'subtitle' }, 'Download JSON file and upload it to apply changes.' )
                , e( 'div', { className: 'container' }, [
                    e( 'article', { className: 'message is-info' }, [
                        e( 'div', { className: 'message-header' }, e( 'p', {}, 'Tips for configuration' ) )
                        , e( 'div', { className: 'message-body' }, e( 'ul', { style: { listStyle: 'inside' } }, [
                            e( 'li', {}, [
                                e( 'span', {}, 'Check out the ' )
                                , e( 'a', {}, 'documentation' )
                                , e( 'span', {}, ' for further information.' )
                            ])
                            , e( 'li', {}, [
                                e( 'span', {}, 'Default file may be downloaded ' )
                                , e( 'a', { href: '/configure/default', target: '_blank' }, 'here' )
                                , e( 'span', {}, '.' )
                            ])
                            , e( 'li', {}, [
                                e( 'span', {}, 'Edit in something like ' )
                                , e( 'a', { href: 'https://www.vim.org/', target: '_blank' }, 'Vim' )
                                , e( 'span', {}, 'or ' )
                                , e( 'a', { href: 'https://notepad-plus-plus.org/', target: '_blank' }, 'Notepad++' )
                                , e( 'span', {}, '.' )
                            ])
                            , e( 'li', {}, 'After uploading a new configuration make sure to close and relaunch the software.' )
                        ]) )
                    ])
                    , e( 'a', { href: '/configure/current', target: '_blank' }, '(Download current configuration.)' )
                    , e( 'br' )
                    , e( 'br' )
                    , e( 'div', { className: 'file has-name is-fullwidth' }, [
                        e( 'label', { className: 'file-label' }, [
                            e( 'input', { className: 'file-input', type: 'file', name: 'configFile', onChange } )
                            , e( 'span', { className: 'file-cta' }, [
                                e( 'span', { className: 'file-icon' }, [
                                    e( 'i', { className: 'fas fa-file-code' } )
                                ])
                                , e( 'span', { className: 'file-label' }, 'Upload DOCX Templates or JSON Configuration File' )
                            ])
                            , e( 'span', { className: 'file-name' }, filename )
                        ])
                    ])
                    , e( 'table', { className: 'table is-striped' }, [
                        e( 'thead', {}, [
                            e( 'tr', {}, [
                                e( 'th', {}, 'Template' )
                                , e( 'th', {}, 'Tools' )
                            ])
                        ])
                        , e( 'tbody', {}, templates.map( tpl => e( 'tr', {}, [
                            e( 'td', {}, tpl )
                            , e( 'td', {}, [
                                e( 'button', { className: 'button is-danger', onClick: ev => deleteTemplate( tpl) }, e( 'span', { className: 'icon' }, e( 'i', { className: 'fa-solid fa-trash fa-lg' } ) ) )
                            ])
                        ])))
                    ])
                    , message[1] ? e( 'article', { className: `message ${ message[0] }` }, e( 'div', { className: 'message-body' }, message[1] ) ) : ''
                ])
            ])
            , e( Footer )
        ])
    };

    ReactDOM.render( React.createElement( Configurator ), document.getElementById( 'root' ) );

})();
//# sourceMappingURL=configure.js.map
