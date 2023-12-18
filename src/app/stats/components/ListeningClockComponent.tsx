"use client"
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ListeningClockComponentProps {
  fileContent: string;
  selectedArtist: string;
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
const getListeningTimeByMonth = (fileContent: string, selectedArtist: string) => {
    const data = JSON.parse(fileContent);
    
    const listeningTimeByMonth = new Map<string, number>();
    data.forEach((record: { artistName: string; endTime: string; msPlayed: number }) => {
        const key = record.endTime.split('-')[1];
        if (record.artistName === selectedArtist) {
        const currentListeningTime = listeningTimeByMonth.get(key) || 0;
        listeningTimeByMonth.set(key, currentListeningTime + record.msPlayed);
        }
    });
    
    const listeningTimeByMonthArray = Array.from(listeningTimeByMonth).map(([key, value]) => ({
        month: key,
        value: Number((value / 60000).toFixed(1)),
    }));
    
    return listeningTimeByMonthArray;
};



const ListeningClockComponent: React.FC<ListeningClockComponentProps> = ({ fileContent, selectedArtist }) => {
  const ref = useRef(null);
    
  const data = getListeningTimeByMonth(fileContent, selectedArtist);
  // for months with no listening time, we add a 0 value
  for (let i = 1; i <= 12; i++) {
      const month = i < 10 ? `0${i}` : `${i}`;
      if (!data.find((d) => d.month === month)) {
          data.push({ month, value: 0 });
      }
  }
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

  }, [data]);

  return (
    <div>
        <svg ref={ref} width={300} height={300} />
    </div>
  );
};

export default ListeningClockComponent;