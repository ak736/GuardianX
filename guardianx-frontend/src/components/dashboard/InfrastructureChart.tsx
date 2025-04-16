"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  name: string;
  power: number;
  water: number;
  telecom: number;
}

interface InfrastructureChartProps {
  data: DataPoint[];
}

const InfrastructureChart: React.FC<InfrastructureChartProps> = ({ data }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Infrastructure Performance</h3>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="power" stroke="#3B82F6" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="water" stroke="#10B981" />
              <Line type="monotone" dataKey="telecom" stroke="#F59E0B" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureChart;