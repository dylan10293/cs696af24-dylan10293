import React from 'react'
import { ProgressBar, Card } from 'react-bootstrap';

const PerformanceCard = ({ metrics, title }) => {
	return (
		<Card className="text-start">
			<Card.Body>
				<Card.Title className="fs-6 text-info-emphasis">{title}</Card.Title>
				<Card.Text>
					{metrics.map((metric, index) => (
						<div key={index} className="mb-3">
							<span className="fs-6">{metric.label}</span>
							<ProgressBar now={metric.value} label={`${metric.value}%`} striped variant="info" />
						</div>
					))}
				</Card.Text>
			</Card.Body>
		</Card>
	)
}

export default PerformanceCard