export function renderCharts(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const padding = 60;
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.clearRect(0, 0, width, height);
  
  if (!data || data.length === 0) {
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.font = '16px Inter';
    ctx.fillText('No spending data available yet', width / 2, height / 2);
    return;
  }

  const maxValue = Math.max(...data.map(d => d.amount), 1);
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const barGap = 20;
  const barWidth = (chartWidth - (data.length - 1) * barGap) / data.length;

  data.forEach((d, i) => {
    const x = padding + i * (barWidth + barGap);
    const barHeight = (d.amount / maxValue) * chartHeight;
    const y = height - padding - barHeight;

    // Gradient for bars
    const gradient = ctx.createLinearGradient(x, y, x, height - padding);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#2563eb');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, barWidth, barHeight, [6, 6, 0, 0]);
    } else {
      ctx.rect(x, y, barWidth, barHeight);
    }
    ctx.fill();

    // Interaction Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    // Label
    ctx.shadowColor = 'transparent';
    // CHANGE: White color for labels in dark mode
    ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#ffffff' : '#475569';
    ctx.font = '500 12px Inter';
    ctx.textAlign = 'center';
    
    // Truncate long labels
    let label = d.name;
    if (label.length > 10) label = label.substring(0, 8) + '...';
    ctx.fillText(label, x + barWidth / 2, height - padding + 25);
    
    // Value
    // CHANGE: White color for values in dark mode
    ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#ffffff' : '#0f172a';
    ctx.font = 'bold 13px Inter';
    ctx.fillText(Math.round(d.amount).toLocaleString() + ' RWF', x + barWidth / 2, y - 10);
  });

  // Draw Axis
  ctx.strokeStyle = document.body.classList.contains('dark-theme') ? '#334155' : '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
}
