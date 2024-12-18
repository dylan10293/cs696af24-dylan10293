import React from 'react'
import { Card } from 'react-bootstrap';
import "./StatCard.css";

const StatCard = ({ title, stat }) => {
	return (
		<Card className="stat-card">
			<Card.Body>
				<Card.Title className="fs-6 text-info-emphasis">{title}</Card.Title>
				<Card.Text className="fs-1">
					{stat.toString()}
				</Card.Text>
			</Card.Body>
		</Card>
	)
}

export default StatCard