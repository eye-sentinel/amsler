document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('amslerGrid');
    const ctx = canvas.getContext('2d');

    const gridSize = 600; // Size of the canvas
    const numLines = 20;  // Number of lines in each direction

    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    const circles = [];  // Store details of all circles

    // Draw the grid
    function drawGrid() {
        ctx.clearRect(0, 0, gridSize, gridSize);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        const step = gridSize / numLines;

        for (let i = 0; i <= numLines; i++) {
            ctx.beginPath();
            ctx.moveTo(i * step, 0);
            ctx.lineTo(i * step, gridSize);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * step);
            ctx.lineTo(gridSize, i * step);
            ctx.stroke();
        }

        // Draw the center point
        ctx.beginPath();
        ctx.arc(gridSize / 2, gridSize / 2, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    // Draw a circle to mark the abnormal area
    function drawCircle(x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0, 0, 255, 0.3)'; // Semi-transparent blue
        ctx.fill();
    }

    // Redraw the grid and all circles
    function redraw() {
        drawGrid();
        for (const circle of circles) {
            drawCircle(circle.x, circle.y, circle.radius);
        }
    }

    // Handle mousedown and touchstart events to start drawing
    function handleStart(event) {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;
        startX = clientX - rect.left;
        startY = clientY - rect.top;
        isDrawing = true;
    }

    // Handle mousemove and touchmove events to draw
    function handleMove(event) {
        if (!isDrawing) return;

        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;
        currentX = clientX - rect.left;
        currentY = clientY - rect.top;

        const radius = Math.sqrt((currentX - startX) ** 2 + (currentY - startY) ** 2);

        // Redraw the grid and draw the current circle
        redraw();
        drawCircle(startX, startY, radius);
    }

    // Handle mouseup and touchend events to finish drawing
    function handleEnd(event) {
        if (isDrawing) {
            event.preventDefault();
            const radius = Math.sqrt((currentX - startX) ** 2 + (currentY - startY) ** 2);
            circles.push({ x: startX, y: startY, radius: radius });

            isDrawing = false;
            redraw();
        }
    }

    // Handle right-click event to remove a circle
    function handleRightClick(event) {
        event.preventDefault(); // Prevent context menu from appearing

        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Check if the click is within any circle
        for (let i = 0; i < circles.length; i++) {
            const circle = circles[i];
            const distance = Math.sqrt((clickX - circle.x) ** 2 + (clickY - circle.y) ** 2);

            if (distance <= circle.radius) {
                // Remove the circle from the array
                circles.splice(i, 1);
                redraw();
                break;
            }
        }
    }

    // Draw the initial grid
    drawGrid();

    // Add event listeners for mouse and touch events
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseout', handleEnd);

    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleEnd);
    canvas.addEventListener('touchcancel', handleEnd);

    canvas.addEventListener('contextmenu', handleRightClick); // Right-click to remove circle
});
