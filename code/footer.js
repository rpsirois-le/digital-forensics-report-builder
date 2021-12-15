const e = React.createElement

export default function Footer() {
    return e( 'footer', { className: 'footer' }, [
        e( 'div', { className: 'content has-text-centered' }, [
            e( 'a', { href: '/' }, 'Home' )
            , e( 'span', {}, ' | ' )
            , e( 'a', { href: '/configure' }, 'Configure' )
            , e( 'span', {}, ' | ' )
            , e( 'a', { href: '/passwords' }, 'Password List' )
            , e( 'span', {}, ' | ' )
            , e( 'a', { href: '/passwords/byowner' }, 'Passwords by Owner' )
            , e( 'br' )
            , e( 'span', {}, '© 2021 Universes Games' )
            , e( 'br' )
            , e( 'a', { href: 'mailto:rpsirois@gmail.com' }, 'Feedback' )
        ])
    ])
}
e
