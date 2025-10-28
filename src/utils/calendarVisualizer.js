import pc from "picocolors";

export function generateCalendarData(
	allLogs,
	weeksToShow = 12,
	customStartDate = null
) {
	const dateMap = new Map();

	allLogs.forEach((log) => {
		const completedSessions = log.sessions.filter(
			(session) =>
				session.status === "mastered" ||
				session.status === "partial"
		);
		const kataTypes = completedSessions.map(
			(session) => session.kataType
		);
		if (kataTypes.length > 0) {
			dateMap.set(log.date, kataTypes);
		}
	});

	let startSunday;

	if (customStartDate) {
		// Start from a specific date (e.g., January 1st for yearly view)
		startSunday = new Date(customStartDate);
		// Go back to the Sunday before or on this date
		const dayOfWeek = startSunday.getDay();
		if (dayOfWeek !== 0) {
			// If not already Sunday
			startSunday.setDate(
				startSunday.getDate() - dayOfWeek
			);
		}
	} else {
		// Default: Calculate start date - go back to the Sunday before (weeksToShow * 7) days ago
		const today = new Date();

		// Find the most recent Sunday (or today if it's Sunday)
		const endSunday = new Date(today);
		const dayOfWeek = endSunday.getDay(); // 0 = Sunday, 6 = Saturday
		endSunday.setDate(endSunday.getDate() - dayOfWeek); // Go back to Sunday

		// Now go back weeksToShow weeks from that Sunday
		startSunday = new Date(endSunday);
		startSunday.setDate(
			startSunday.getDate() - weeksToShow * 7 + 7
		); // +7 to include current week
	}

	// Build weeks array starting from that Sunday
	const weeks = [];
	let currentDate = new Date(startSunday);

	for (let week = 0; week < weeksToShow; week++) {
		const weekDays = [];

		for (let day = 0; day < 7; day++) {
			const dateString = currentDate
				.toISOString()
				.slice(0, 10);
			const kataTypes = dateMap.get(dateString) || [];

			weekDays.push({
				date: dateString,
				kataTypes: kataTypes,
				count: kataTypes.length,
			});

			currentDate.setDate(currentDate.getDate() + 1);
		}

		weeks.push(weekDays);
	}

	const monthLabels = calculateMonthLabels(weeks);
	return { weeks, monthLabels };
}

/**
 * Helper function to calculate where month labels should appear
 */
function calculateMonthLabels(weeks) {
	if (!weeks || weeks.length === 0) {
		return [];
	}

	const monthLabels = [];
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	let lastMonth = null;

	// Loop through weeks and find month boundaries
	weeks.forEach((week, weekIndex) => {
		// Check the first day of the week to determine which month
		const firstDate = new Date(week[0].date);
		const currentMonth = firstDate.getMonth();

		// If month changed, add a label
		if (currentMonth !== lastMonth) {
			monthLabels.push({
				weekIndex: weekIndex,
				label: monthNames[currentMonth],
				month: currentMonth, // Store numeric month for calculations
			});
			lastMonth = currentMonth;
		}
	});

	// Calculate spacing and determine if abbreviation needed
	monthLabels.forEach((label, index) => {
		// Calculate how many weeks this month spans
		const nextWeekIndex =
			index < monthLabels.length - 1
				? monthLabels[index + 1].weekIndex
				: weeks.length;

		const weeksSpanned = nextWeekIndex - label.weekIndex;
		const charactersAvailable = weeksSpanned * 2; // Each week = 2 chars (symbol + space)

		// If less than 4 characters available, use single letter
		if (charactersAvailable < 4) {
			label.displayLabel = label.label.charAt(0); // 'J', 'F', 'M', etc.
		} else {
			label.displayLabel = label.label; // 'Jan', 'Feb', 'Mar', etc.
		}
	});

	return monthLabels;
}

/**
 * Renders the calendar heatmap to console
 * @param {Object} calendarData - Output from generateCalendarData()
 */
export function renderCalendar(calendarData) {
	const { weeks, monthLabels } = calendarData;

	// Dracula color functions using ANSI escape codes
	// picocolors doesn't have rgb() - use direct ANSI codes instead
	const colors = {
		empty: (text) => `\x1b[2m${text}\x1b[0m`, // dim gray
		miniKata: (text) =>
			`\x1b[38;2;80;250;123m${text}\x1b[0m`, // soft green #50fa7b
		namiKata: (text) =>
			`\x1b[38;2;189;147;249m${text}\x1b[0m`, // soft purple #bd93f9
		devKata: (text) =>
			`\x1b[38;2;139;233;253m${text}\x1b[0m`, // soft cyan #8be9fd
		multiple: (text) =>
			`\x1b[38;2;255;121;198m${text}\x1b[0m`, // bright pink #ff79c6
		label: (text) => `\x1b[38;2;255;184;108m${text}\x1b[0m`, // orange #ffb86c
	};

	console.log("\n");

	// Render month labels
	let monthRow = "    "; // Initial padding for day labels (4 chars)
	let lastPosition = 4;

	monthLabels.forEach((label) => {
		// Calculate position: each week takes 2 characters (symbol + space)
		const targetPosition = 4 + label.weekIndex * 2;

		// Pad to the correct position with spaces
		const spacesNeeded = targetPosition - lastPosition;
		if (spacesNeeded > 0) {
			monthRow += " ".repeat(spacesNeeded);
		}

		// Use displayLabel (which is either full or abbreviated)
		const labelText = colors.label(label.displayLabel);
		monthRow += labelText;

		// Track position (note: ANSI color codes don't add to visible length)
		// The displayLabel is 1-3 chars visible
		lastPosition =
			targetPosition + label.displayLabel.length;
	});

	console.log(monthRow);

	// Render each day of the week
	const dayNames = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat",
	];

	for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
		// Print day name
		process.stdout.write(
			colors.label(dayNames[dayIndex].padEnd(4))
		);

		// TODO: Print each week's cell for this day
		for (
			let weekIndex = 0;
			weekIndex < weeks.length;
			weekIndex++
		) {
			const day = weeks[weekIndex][dayIndex];
			const cell = getCellDisplay(day, colors);
			process.stdout.write(cell + " ");
		}

		console.log(); // New line after each day row
	}

	console.log("\n");

	// TODO: Add legend at bottom
	console.log(colors.label("Legend:"));
	console.log(`  ${colors.empty("□")} No kata`);
	console.log(`  ${colors.miniKata("■")} miniKata`);
	console.log(`  ${colors.namiKata("■")} namiKata`);
	console.log(`  ${colors.devKata("■")} devKata`);
	console.log(`  ${colors.multiple("■")} Multiple katas`);
	console.log("\n");
}

/**
 * Determines what symbol/color to use for a day cell
 */
function getCellDisplay(day, colors) {
	if (day.count === 0) {
		return colors.empty("□");
	}

	if (day.count > 1) {
		return colors.multiple("■"); // Achievement!
	}

	// Single kata - determine type
	const kataType = day.kataTypes[0];

	// TODO: Return the appropriate colored symbol based on kataType
	switch (kataType) {
		case "miniKata":
			return colors.miniKata("■");
		case "namiKata":
			return colors.namiKata("■");
		case "devKata":
			return colors.devKata("■");
		default:
			return colors.empty("□");
	}
}

// TEMP: For testing
if (import.meta.url === `file://${process.argv[1]}`) {
	// Generate realistic mock logs for last 60 days
	const mockLogs = [];

	// Generate logs for last 60 days to span multiple months
	for (let i = 0; i < 60; i++) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		const dateString = date.toISOString().slice(0, 10);

		// Randomly add katas (70% chance)
		if (Math.random() > 0.3) {
			const kataTypes = ["miniKata", "namiKata", "devKata"];
			const randomKata =
				kataTypes[
					Math.floor(Math.random() * kataTypes.length)
				];

			// Sometimes add multiple katas (20% chance for achievement!)
			const sessions =
				Math.random() > 0.8
					? [
							{ status: "mastered", kataType: randomKata },
							{
								status: "partial",
								kataType:
									kataTypes[
										Math.floor(
											Math.random() * kataTypes.length
										)
									],
							},
					  ]
					: [{ status: "mastered", kataType: randomKata }];

			mockLogs.push({
				date: dateString,
				sessions: sessions,
			});
		}
	}

	console.log(
		"Testing calendar visualization with realistic data...\n"
	);
	console.log(
		`Generated ${mockLogs.length} days of mock kata data\n`
	);

	const calendarData = generateCalendarData(mockLogs, 12); // Show 12 weeks
	console.log(
		"Month labels:",
		JSON.stringify(calendarData.monthLabels, null, 2)
	);
	console.log("\n");
	renderCalendar(calendarData);
}
