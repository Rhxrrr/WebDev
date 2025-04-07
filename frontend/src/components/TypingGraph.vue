<script setup>
import * as d3 from "d3";
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { debounce } from "lodash-es";

// Props to receive typing state and performance metrics
const props = defineProps({
  typingStarted: Boolean,
  typingEnded: Boolean,
  wpm: Number,
  accuracy: Number,
});

// Refs for DOM elements and reactive values
const containerRef = ref(null);
const svgRef = ref(null);
const data = ref([]);
const graphWidth = ref(800);
let time = 0;

// Resize observer to keep SVG width responsive
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.contentRect) {
      graphWidth.value = entry.contentRect.width;
      drawGraph(); // Re-draw on resize
    }
  }
});

onMounted(() => {
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }
});

onBeforeUnmount(() => {
  if (containerRef.value) {
    resizeObserver.unobserve(containerRef.value);
  }
});

// Start/stop tracking based on typing state
watch(
  () => [props.typingStarted, props.typingEnded],
  ([started, ended]) => {
    if (started && !ended) {
      startTracking();
    } else {
      stopTracking();
    }
  },
  { immediate: true }
);

// Track WPM and accuracy updates during typing
watch(
  () => [props.wpm, props.accuracy],
  ([newWpm, newAccuracy]) => {
    if (props.typingStarted && !props.typingEnded) {
      data.value.push({ time, wpm: newWpm, accuracy: newAccuracy });
      time++;
      updateGraph();
    }
  }
);

// Reset tracking state
function startTracking() {
  data.value = [];
  time = 0;
}

function stopTracking() {
  // Placeholder for cleanup if needed
}

// Debounced draw function for performance
const updateGraph = debounce(() => drawGraph(), 100);
updateGraph();

// Draw or update the graph using D3
function drawGraph() {
  if (!svgRef.value) return;

  const svg = d3.select(svgRef.value);
  svg.selectAll("*").remove(); // Clear previous drawings

  // Use default data if empty
  const graphData =
    data.value.length > 0 ? data.value : [{ time: 0, wpm: 0, accuracy: 0 }];

  const width = graphWidth.value;
  const height = 260;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };

  // Theme variables
  const paigeColor = "#FFD8A9";
  const accuracyColor = "#888888";
  const axisColor = "#AAAAAA";
  const bgTooltip = "#1E1E1E";
  const textColor = "#FFD8A9";

  // X and Y scales
  const x = d3
    .scaleLinear()
    .domain([1, d3.max(graphData, (d) => d.time) || 1])
    .range([margin.left, width - margin.right]);

  const y = d3
    .scaleLinear()
    .domain([
      0,
      Math.ceil(
        Math.max(
          100,
          d3.max(graphData, (d) => Math.max(d.wpm, d.accuracy))
        ) / 10
      ) * 10,
    ])
    .range([height - margin.bottom, margin.top]);

  // Line generators
  const lineWPM = d3
    .line()
    .curve(d3.curveMonotoneX)
    .x((d) => x(d.time))
    .y((d) => y(d.wpm));

  const lineAccuracy = d3
    .line()
    .curve(d3.curveMonotoneX)
    .x((d) => x(d.time))
    .y((d) => y(d.accuracy));

  // Background grid
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(8)
        .tickSize(-height + margin.top + margin.bottom)
        .tickFormat("")
    )
    .attr("stroke", axisColor)
    .attr("stroke-opacity", 0.05);

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(
      d3
        .axisLeft(y)
        .ticks(6)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat("")
    )
    .attr("stroke", axisColor)
    .attr("stroke-opacity", 0.05);

  // WPM and Accuracy lines
  svg
    .append("path")
    .datum(graphData)
    .attr("fill", "none")
    .attr("stroke", paigeColor)
    .attr("stroke-width", 2.5)
    .attr("d", lineWPM);

  svg
    .append("path")
    .datum(graphData)
    .attr("fill", "none")
    .attr("stroke", accuracyColor)
    .attr("stroke-width", 2)
    .attr("d", lineAccuracy);

  // Axes labels
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(8).tickFormat(d3.format("d")))
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll("text").attr("fill", axisColor));

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll("text").attr("fill", axisColor))
    .call((g) =>
      g
        .append("text")
        .attr("fill", textColor)
        .attr("x", -margin.left + 5)
        .attr("y", margin.top - 10)
        .text("Words per Minute")
        .attr("font-size", "12px")
    );

  // Legend
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - 140},${margin.top})`);

  legend
    .append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", paigeColor);

  legend
    .append("text")
    .attr("x", 18)
    .attr("y", 10)
    .text("WPM")
    .attr("fill", textColor)
    .attr("font-size", "12px");

  legend
    .append("rect")
    .attr("y", 20)
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", accuracyColor);

  legend
    .append("text")
    .attr("x", 18)
    .attr("y", 30)
    .text("Accuracy")
    .attr("fill", textColor)
    .attr("font-size", "12px");

  // Show message when no data available
  if (data.value.length === 0) {
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", axisColor)
      .attr("font-size", "16px")
      .text("Waiting to start...");
    return;
  }

  // Tooltip group for hover interaction
  const focus = svg.append("g").style("display", "none");

  const wpmPoint = focus
    .append("circle")
    .attr("r", 4.5)
    .attr("fill", paigeColor);

  const accPoint = focus
    .append("circle")
    .attr("r", 4.5)
    .attr("fill", accuracyColor);

  const tooltipBox = focus
    .append("rect")
    .attr("fill", bgTooltip)
    .attr("stroke", paigeColor)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", 100)
    .attr("height", 40)
    .attr("x", 10)
    .attr("y", -22);

  const tooltipText = focus
    .append("text")
    .attr("x", 14)
    .attr("y", -8)
    .attr("fill", textColor)
    .attr("font-size", "11px");

  // Tooltip event handling
  svg
    .append("rect")
    .attr("fill", "transparent")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", () => focus.style("display", null))
    .on("mouseout", () => focus.style("display", "none"))
    .on("mousemove", function (event) {
      const bisect = d3.bisector((d) => d.time).left;
      const x0 = x.invert(d3.pointer(event, this)[0]);
      const i = bisect(graphData, x0, 1);
      const d0 = graphData[i - 1];
      const d1 = graphData[i];
      const d = x0 - d0.time > (d1?.time ?? Infinity) - x0 ? d1 : d0;
      if (!d) return;

      wpmPoint.attr("cx", x(d.time)).attr("cy", y(d.wpm));
      accPoint.attr("cx", x(d.time)).attr("cy", y(d.accuracy));

      const tooltipX = x(d.time);
      const tooltipY = y(d.wpm);
      const tooltipWidth = 100;
      const tooltipHeight = 40;
      const padding = 10;
      const shouldFlip = tooltipX + tooltipWidth + padding > width;

      tooltipBox
        .attr(
          "x",
          shouldFlip ? tooltipX - tooltipWidth - padding : tooltipX + padding
        )
        .attr("y", tooltipY - tooltipHeight / 2);

      tooltipText
        .attr(
          "x",
          shouldFlip
            ? tooltipX - tooltipWidth - padding + 4
            : tooltipX + padding + 4
        )
        .attr("y", tooltipY - tooltipHeight / 2 + 14)
        .text(`wpm: ${d.wpm}  acc: ${d.accuracy}%`);
    });

  // Draw final data point markers
  const latest = graphData[graphData.length - 1];
  if (latest) {
    svg
      .append("circle")
      .attr("cx", x(latest.time))
      .attr("cy", y(latest.wpm))
      .attr("r", 5)
      .attr("fill", paigeColor)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    svg
      .append("circle")
      .attr("cx", x(latest.time))
      .attr("cy", y(latest.accuracy))
      .attr("r", 5)
      .attr("fill", accuracyColor)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);
  }
}
</script>

<template>
  <div
    ref="containerRef"
    class="w-full max-w-[1000px] px-4 flex justify-center items-center mt-12 mb-6"
  >
    <svg ref="svgRef" :width="graphWidth" height="260"></svg>
  </div>
</template>
