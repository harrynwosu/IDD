import PropTypes from 'prop-types';

const PillToggle = ({ activeView, setActiveView }) => {
    const handleToggle = (view) => {
        setActiveView(view);
    };

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px',
        },
        toggleContainer: {
            position: 'relative',
            display: 'inline-flex',
            backgroundColor: '#e0e0e0',
            borderRadius: '30px',
            padding: '3px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        },
        slider: {
            position: 'absolute',
            top: '3px',
            bottom: '3px',
            left: activeView === 'map' ? '3px' : '50%',
            width: 'calc(50% - 3px)',
            backgroundColor: '#2563eb',
            borderRadius: '25px',
            transition: 'left 0.3s ease',
        },
        button: {
            position: 'relative',
            zIndex: '1',
            padding: '10px 20px',
            borderRadius: '25px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: '100px',
            transition: 'color 0.3s ease',
        },
        activeButton: {
            color: 'white',
        },
        inactiveButton: {
            color: '#555555',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.toggleContainer}>
                <div style={styles.slider}></div>

                <button
                    style={{
                        ...styles.button,
                        ...(activeView === 'map'
                            ? styles.activeButton
                            : styles.inactiveButton),
                    }}
                    onClick={() => handleToggle('map')}
                >
                    Map View
                </button>

                <button
                    style={{
                        ...styles.button,
                        ...(activeView === 'list'
                            ? styles.activeButton
                            : styles.inactiveButton),
                    }}
                    onClick={() => handleToggle('list')}
                >
                    List View
                </button>
            </div>
        </div>
    );
};

PillToggle.propTypes = {
    activeView: PropTypes.string.isRequired,
    setActiveView: PropTypes.func.isRequired,
};

export default PillToggle;
