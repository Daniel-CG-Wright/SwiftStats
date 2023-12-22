"use client"
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { months } from '@/util/dateTimeFormat';
import { NumberByMonth } from '@/types';

interface ListeningClockComponentProps {
    data: NumberByMonth[];
    year: string;
}



const ListeningClockComponent: React.FC<ListeningClockComponentProps> = ({ data, year }) => {
  const ref = useRef(null);
  const width = 500; // Adjust as needed
  const height = 500; // Adjust as needed
  useEffect(() => {
    if (data.length === 0) return;
    // Remove previous chart
    d3.select(ref.current).selectAll('*').remove();

    const svg = d3.select(ref.current);
    
    const radius = Math.min(width, height) / 2;
    
    // Scales for the bars
    const xScale = d3.scaleBand().range([0, 2 * Math.PI]).domain(data.map(d => d.month));
    const yScale = d3.scaleRadial().range([20, radius]).domain([0, d3.max(data, d => d.value)]);

    // Add bars
    svg.append('g')
        .selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('fill', '#1db954') // Spotify green, or any color you prefer
        .attr('d', d3.arc() // Construct the bar shape
            .innerRadius(20)
            .outerRadius(d => yScale(d.value))
            .startAngle(d => xScale(d.month))
            .endAngle(d => xScale(d.month) + xScale.bandwidth())
            .padAngle(0.01)
            .padRadius(radius))
        .attr('transform', `translate(${width / 2}, ${height / 2})`)
        .attr('data-tip', d => `Listening Time: ${d.value} minutes`)

        // Add labels
        const labelRadius = radius * 0.4; // Adjust this to place labels inside or outside the bars
        svg.append('g')
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', d => {
            const angle = xScale(d.month) + xScale.bandwidth() / 2;
            const rotateAngle = (angle * 180 / Math.PI) - 90; // Convert to degrees and offset
            const xPosition = Math.cos(angle - Math.PI / 2) * labelRadius;
            const yPosition = Math.sin(angle - Math.PI / 2) * labelRadius;
            return `translate(${width / 2 + xPosition}, ${height / 2 + yPosition}) rotate(${rotateAngle})`;
        })
        .attr('dy', '0.35em')
        .attr('text-anchor', "start")
        .text(d => months[parseInt(d.month) - 1])
        .attr('fill', 'white');



  }, [data]);

  return (
    <div className="flex justify-center h-full w-full flex-grow">
        <svg ref={ref} width={width} height={height} />
    </div>

  );
};

export default ListeningClockComponent;