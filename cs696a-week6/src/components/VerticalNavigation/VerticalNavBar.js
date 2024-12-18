import React from 'react';

import { FaHome, FaUsers, FaChartBar, FaCartPlus, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import { Button, Navbar, Nav } from 'react-bootstrap';

import "./VerticalNavBar.css"

///// TODO: Use React Bootstrap’s Nav component to create a vertical navigation menu.
///// TODO: Include at least 5 menu items with icons(you can use React icons or Font Awesome).
// TODO: Ensure the sidebar is collapsible on smaller screens.

const VerticalNavBar = ({ toggleSidebar, sidebarCollapsed }) => {

	const options = [{
		text: "Dashboard",
		href: "/dashboard",
		icon: <FaHome />
	}, {
		text: "Users",
		href: "/users",
		icon: <FaUsers />
	}, {
		text: "Analytics",
		href: "/Analytics",
		icon: <FaChartBar />
	}, {
		text: "Orders",
		href: "/Orders",
		icon: <FaCartPlus />
	}, {
		text: "Settings",
		href: "/Settings",
		icon: <FaCog />
	}]

	return (
		<Navbar expand="lg" className={`side-bar p-3 align-items-start text-start bg-dark ${sidebarCollapsed ? 'collapsed' : ''}`}>
			<div className="nav-container">
				<div className="nav-header">
					<Button className="close-sidebar" variant="outline-none" onClick={toggleSidebar}>
						<FaTimes />
					</Button>
					<Navbar.Brand href="#home" className="ps-3 text-info-emphasis">DManMoney</Navbar.Brand>
				</div>

				<Nav className="flex-column w-100 mt-3">
					{options.map(({ text, href, icon }) => (
						<Nav.Link href={href} className="d-flex align-items-center">
							{icon}<span>{text}</span>
						</Nav.Link>
					))}
				</Nav>
			</div>
		</Navbar>
	)
}

export default VerticalNavBar