"use client"
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { months } from '@/util/dateTimeFormat';

interface ListeningClockComponentProps {
    fileContent: string;
    selectedArtist: string;
    startDate: string;
    endDate: string;
}

interface ListeningTimeByMonth {
    month: string;
    value: number;
}

/**
 * This function gets the listening time for each month of the year for the selected artist
 * @param fileContent the JSON content of the file
 * @param selectedArtist the artist selected by the user
 * @returns an array of objects with the month and the total listening time for that month {
 * month: string,
 * value: number}
 */
// ListeningClockComponent.tsx

const getListeningTimeByMonth = (fileContent: string, selectedArtist: string, startDate: string, endDate: string): ListeningTimeByMonth[] => {
    const data = JSON.parse(fileContent);

    const listeningTimeByMonth = new Map<string, number>();

    data.forEach((record: { artistName: string; endTime: string; msPlayed: number }) => {
        // Convert record's endTime to YYYY-MM-DD format
        const recordTime = record.endTime.split(' ')[0];

        // Only process records within the date range
        if (recordTime >= startDate && recordTime <= endDate) {
            const key = record.endTime.split('-')[1];
            if (record.artistName === selectedArtist) {
                const currentListeningTime = listeningTimeByMonth.get(key) || 0;
                listeningTimeByMonth.set(key, currentListeningTime + record.msPlayed);
            }
        }
    });

    const listeningTimeByMonthArray = Array.from(listeningTimeByMonth).map(([key, value]) => ({
        month: key,
        value: Number((value / 60000).toFixed(1)),
    }));

    // for months with no listening time, add 0
    for (let i = 1; i <= 12; i++) {
        if (!listeningTimeByMonthArray.some((record: ListeningTimeByMonth) => record.month === i.toString())) {
            listeningTimeByMonthArray.push({ month: i.toString(), value: 0 });
        }
    }

    return listeningTimeByMonthArray.sort((a, b) => Number(a.month) - Number(b.month));
};


const ListeningClockComponent: React.FC<ListeningClockComponentProps> = ({ fileContent, selectedArtist, startDate, endDate }) => {
  const ref = useRef(null);
    
  const data = getListeningTimeByMonth(fileContent, selectedArtist, startDate, endDate);

  useEffect(() => {
    if (data.length === 0) return;
    // Remove previous chart
    d3.select(ref.current).selectAll('*').remove();

    const svg = d3.select(ref.current);
    const width = 300; // Adjust as needed
    const height = 300; // Adjust as needed
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
    <div className="bg-dark flex justify-center h-full w-full flex-grow">
        <svg ref={ref} width={500} height={500} />
    </div>

  );
};

export default ListeningClockComponent;