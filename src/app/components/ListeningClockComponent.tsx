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
    const maxValue = d3.max(data, d => d.value);
    const yScale = d3.scaleRadial().range([20, radius]).domain([0, maxValue !== undefined ? maxValue : 0]);

    // Add bars
    svg.append('g')
    .selectAll('path')
    .data(data.map(d => ({
        ...d,
        innerRadius: 20,
        outerRadius: yScale(d.value) || 0,
        startAngle: xScale(d.month) || 0,
        endAngle: (xScale(d.month) || 0) + xScale.bandwidth()
    })))
    .enter()
    .append('path')
    .attr('fill', '#1db954') // Spotify green, or any color you prefer
    .attr('d', d3.arc() // Construct the bar shape
        .innerRadius(d => d.innerRadius)
        .outerRadius(d => d.outerRadius)
        .startAngle(d => d.startAngle)
        .endAngle(d => d.endAngle)
        .padAngle(0.01)
        .padRadius(radius))
    .attr('transform', `translate(${width / 2}, ${height / 2})`)
    .attr('data-tip', d => `Listening Time: ${d.value} minutes`)
        .on('mouseover', function() {
          d3.select('#tooltip').style('visibility', 'visible');
          d3.select(this).attr('fill', '#1ed760');
        })
        .on('mousemove', function(event, d) {
            d3.select('#tooltip')
                .text(`${months[parseInt(d.month)-1]}: ${d.value} minutes`)
                .style('left', `${event.pageX}px`)
                .style('top', `${event.pageY}px`);
        })
        .on('mouseout', function() {
            d3.select('#tooltip').style('visibility', 'hidden');
            d3.select(this).attr('fill', '#1db954');
        });

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
            const angle = (xScale(d.month) || 0) + xScale.bandwidth() / 2;
            const rotateAngle = (angle * 180 / Math.PI) - 90; // Convert to degrees and offset
            const xPosition = Math.cos(angle - Math.PI / 2) * labelRadius;
            const yPosition = Math.sin(angle - Math.PI / 2) * labelRadius;
            return `translate(${width / 2 + xPosition}, ${height / 2 + yPosition}) rotate(${rotateAngle})`;
        })
        .attr('dy', '0.35em')
        .attr('text-anchor', "start")
        .text(d => months[parseInt(d.month) - 1])
        .on('mouseover', function() {
          d3.select('#tooltip').style('visibility', 'visible');
        })
        .on('mousemove', function(event, d) {
            d3.select('#tooltip')
                .text(`${months[parseInt(d.month)-1]}: ${d.value} minutes`)
                .style('left', `${event.pageX}px`)
                .style('top', `${event.pageY}px`);
        })
        .on('mouseout', function() {
            d3.select('#tooltip').style('visibility', 'hidden');
        })
        .attr('fill', 'white');



  }, [data]);

  return (
    <div className="flex justify-center h-full w-full flex-grow">
        <div id="tooltip" className="tooltip"></div>
        <svg ref={ref} width={width} height={height} />
    </div>

  );
};

export default ListeningClockComponent;