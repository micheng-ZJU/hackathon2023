const styles = {
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(224,255,255,0.5)',

    },
    button: {
        padding: '15px, 30px',
        marginBottom: '20px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-corlor 0.3s',
        color: '#000',
        fontSize: '18px'
    },
    idle: {
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    execution: {
        backgroundColor: 'orange',
    },
    error: {
        backgroundColor: "pink",
    },
    text: {
        margin: '10px 0',
        fontSize: '18px',
        height: '48px',
        color: '#000',
        fontFamily: 'Calibri, sans-serif'
    }
}

export default styles