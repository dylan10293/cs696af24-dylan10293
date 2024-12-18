import React, { useState } from 'react'
import "./HeaderBar.css";

import { Form, FormControl, Button, Dropdown, Nav } from 'react-bootstrap';
import { FaSearch, FaBell, FaUser, FaBars } from "react-icons/fa";

// Create a header that spans the top of the page(excluding the sidebar).
// Include a search bar, a notifications icon, and a user profile dropdown.

const HeaderBar = ({ toggleSidebar, sidebarCollapsed }) => {

	const [search, setSearch] = useState("");

	const hardcodedSearchValues = [
		'Dashboard',
		'Profile',
		'Settings',
		'Notifications'
	];

	return (
		<div className="top-bar">
			<div className="sidebar-controls">
				<Button className="toggle-sidebar" variant="outline-none" onClick={toggleSidebar}>
					<FaBars />
				</Button>
				<Form className="search ms-2">
					<Button variant="outline-light">
						<FaSearch />
					</Button>
					<FormControl
						type="search"
						placeHolder="Search"
						aria-label="Search"
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
						}}
					/>
					{search && (
						<div className="search-results bg-dark">
							<ul class="list-group">
								{hardcodedSearchValues.filter((result) => {
									console.log('result: ', result);
									console.log('search.toLowerCase: ', search.toLowerCase);
									return result.toLowerCase().includes(search.toLowerCase());
								}).map((result, index) => (
									<Nav.Link href={`\\${result.toLowerCase()}`}>
										<li className="list-group-item" key={index}>
											{result}
										</li>
									</Nav.Link>
								))}
							</ul>
						</div>
					)}
				</Form>
			</div>
			<div className="title">
				<span>{window.location.pathname.slice(1)}</span>
			</div>
			<div className="profile-section">

				<Button className="ms-2" variant="outline-none">
					<FaBell />
				</Button>

				<Dropdown className="ms-2">
					<Dropdown.Toggle variant="outline-none" id="dropdown-basic">
						<FaUser />
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Header>Oh, hello there!</Dropdown.Header>
						<Dropdown.Item href="/profile">Profile</Dropdown.Item>
						<Dropdown.Item href="/logout">Logout</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</div >
	)
}

export default HeaderBar