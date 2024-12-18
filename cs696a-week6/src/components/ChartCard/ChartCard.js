import React from 'react';
import { Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const ChartCard = ({ data }) => {


	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			// title: {
			// 	display: true,
			// 	text: 'Sales Overview',
			// },
		},
	};

	return (
		<Card className="text-start">
			<Card.Body>
				<Card.Title className="fs-6 text-info-emphasis">Sales Overview</Card.Title>
				<Line data={data} options={options} />
			</Card.Body>
		</Card>
	);
};

export default ChartCard;
