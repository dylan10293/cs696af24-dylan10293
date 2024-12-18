import React from 'react'
import { Table, Card } from 'react-bootstrap';

const ActivityCard = ({ title, activities }) => {
	return (
		<Card className="text-start">
			<Card.Body>
				<Card.Title className="fs-6 text-info-emphasis">{title}</Card.Title>
				<Card.Text>
					<Table striped bordered hover responsive>
						<thead>
							<tr>
								<th>#</th>
								<th>Action</th>
								<th>User</th>
								<th>Time</th>
							</tr>
						</thead>
						<tbody>
							{activities.map((activity) => (
								<tr key={activity.id}>
									<td>{activity.id}</td>
									<td>{activity.action}</td>
									<td>{activity.user}</td>
									<td>{activity.time}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Card.Text>
			</Card.Body>
		</Card>
	)
}

export default ActivityCard