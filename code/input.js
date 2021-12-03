const e = React.createElement

const Input = ( props ) => {
    const { name, label, type, value, onChange } = props

    return e( 'div', { className: 'field' }, [
        e( 'label', { className: 'label' }, label )
        , e( 'div', { className: 'control' }, [
            e( 'input', { className: 'input', name, type, value, placeholder: label, onChange } )
        ])
    ])
}

export default Input
