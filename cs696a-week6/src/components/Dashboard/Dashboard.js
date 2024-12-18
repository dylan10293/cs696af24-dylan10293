import React from 'react'
import StatCard from "../StatsCard/StatCard"
import ChartCard from '../ChartCard/ChartCard'
import ActivityCard from '../ActivityCard/ActivityCard'
import PerformanceCard from '../PerformanceCard/PerformanceCard'

const Dashboard = () => {
	const stats = [{
		title: "Total Users",
		stat: "10,000"
	}, {
		title: "Revenue",
		stat: "23,324$"
	}, {
		title: "Orders",
		stat: 102
	}, {
		title: "Conversion Rate",
		stat: 3.75
	},]

	const chartData = {
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [
			{
				label: 'Dataset 1',
				data: [65, 59, 80, 81, 56, 55, 40],
				borderColor: 'rgba(75, 192, 192, 1)',
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				fill: true,
			},
		],
	};

	const activities = [
		{ id: 1, action: 'Login', user: 'John Doe', time: '2024-10-19 10:30' },
		{ id: 2, action: 'Viewed Dashboard', user: 'Jane Smith', time: '2024-10-19 11:00' },
		{ id: 3, action: 'Uploaded File', user: 'John Doe', time: '2024-10-19 11:45' },
		{ id: 4, action: 'Logout', user: 'Jane Smith', time: '2024-10-19 12:15' },
		{ id: 5, action: 'Login', user: 'Michael Johnson', time: '2024-10-19 13:00' },
	];

	const metrics = [
		{ label: 'CPU Usage', value: 70 },
		{ label: 'Memory Usage', value: 85 },
		{ label: 'Disk Usage', value: 45 },
		{ label: 'Network Latency', value: 60 }
	];

	return (
		<div className="">
			<div className="row g-2">
				{stats.map(({ title, stat }) => (
					<div className="col-12 col-md-6 col-lg-3">
						<StatCard title={title} stat={stat} />
					</div>
				))}
				<div className="col-12">
					<PerformanceCard metrics={metrics} title={"Performance Metrics"} />
				</div>
				<div className="col-12 col-md-6">
					<ActivityCard activities={activities} title={"Recent Activity"} />
				</div>
				<div className="col-12 col-md-6">
					<ChartCard data={chartData} />
				</div>
			</div>
		</div>
	)
}

export default Dashboard