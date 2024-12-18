import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
	return (
		<footer className="footer bg-dark-subtle py-2 text-info-emphasis">
			<div className="text-center">
				<p className="m-0">© {new Date().getFullYear()} DManMoney. All Rights Reserved.</p>
			</div>
		</footer>
	);
}

export default Footer;
