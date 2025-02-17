import '../styles/Footer.css';

const Footer = () => {
    return (
        <div style={{ 
            width: '100%', 
            height: 233, 
            background: 'white', 
            borderTop: '1px #B3B3B3 solid', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'space-evenly', 
            padding: '20px 0' 
        }}>
            {/* Keystone Alliance at the top */}
            <div style={{ 
                width: 424, 
                height: 72, 
                textAlign: 'center', 
                color: 'black', 
                fontSize: 36, 
                fontFamily: 'Inter', 
                fontWeight: '700', 
                lineHeight: '50.40px', 
                wordWrap: 'break-word' 
            }}>
                Keystone Alliance
            </div>
            
            {/* Directory, Account, and Support in a row */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-evenly', 
                width: '100%' 
            }}>
                <div style={{ 
                    width: 186, 
                    height: 62, 
                    textAlign: 'center', 
                    color: 'black', 
                    fontSize: 24, 
                    fontFamily: 'Inter', 
                    fontWeight: '400', 
                    lineHeight: '33.60px', 
                    wordWrap: 'break-word' 
                }}>
                    Directory
                </div>
                <div style={{ 
                    width: 186, 
                    height: 62, 
                    textAlign: 'center', 
                    color: 'black', 
                    fontSize: 24, 
                    fontFamily: 'Inter', 
                    fontWeight: '400', 
                    lineHeight: '33.60px', 
                    wordWrap: 'break-word' 
                }}>
                    Account
                </div>
                <div style={{ 
                    width: 186, 
                    height: 62, 
                    textAlign: 'center', 
                    color: 'black', 
                    fontSize: 24, 
                    fontFamily: 'Inter', 
                    fontWeight: '400', 
                    lineHeight: '33.60px', 
                    wordWrap: 'break-word' 
                }}>
                    Support
                </div>
            </div>
        </div>
    );
}

export default Footer;
