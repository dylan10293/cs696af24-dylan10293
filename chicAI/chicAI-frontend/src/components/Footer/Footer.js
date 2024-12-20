import { Container, Row, Nav } from 'react-bootstrap'
import './Footer.css'

function Footer() {
    return (
        <footer>
            <Container className='Footer' fluid>
                <Row>
                    <div className="footer-content text-white">
                        <div>
                            <h6>&copy; CtrlAltDelete </h6>
                            <p style={{ color: "#e0e0e0" }}>All rights reserved.</p>
                            {/* <a href="mailto:fk61462n@pace.edu" className="text-white">
                                care@chicai.com
                            </a> */}
                        </div>

                        <Nav className="flex-column footer-links">
                            <h6>Navigation</h6>
                            <Nav.Link href="/outfits" className='text-white'>Outfits</Nav.Link>
                            <Nav.Link href="/wardrobe-management" className='text-white'>Wardrobe</Nav.Link>
                            <Nav.Link href="/laundry" className='text-white'>Laundry</Nav.Link>
                        </Nav>

                    </div>
                </Row>

            </Container>
        </footer >
    )
}

export default Footer