import {
	intro,
	outro,
	text,
	select,
	isCancel,
} from "@clack/prompts";
import pc from "picocolors";

import { getAllLogs } from "../utils/logger.js";
import {
	calculateTotalKatas,
	calculateStreak,
	getCategoryStats,
	getArticlesRead,
	getReposReviewed,
	getSessionsInRange,
	calculateAverageDuration,
} from "../utils/statsHelper.js";
import {
	generateCalendarData,
	renderCalendar,
} from "../utils/calendarVisualizer.js";
import {
	resetStats,
	restoreStats,
} from "../utils/resetStats.js";

const dracula = {
	success: (text) => pc.green(text),
	error: (text) => pc.red(text),
	info: (text) => pc.yellow(text),
	special: (text) => pc.magenta(text),
	alt: (text) => pc.cyan(text),
	dim: (text) => pc.dim(text),
	// Dracula RGB colors using ANSI
	orange: (text) => `\x1b[38;2;255;184;108m${text}\x1b[0m`,
	purple: (text) => `\x1b[38;2;189;147;249m${text}\x1b[0m`,
	pink: (text) => `\x1b[38;2;255;121;198m${text}\x1b[0m`,
	green: (text) => `\x1b[38;2;80;250;123m${text}\x1b[0m`,
	cyan: (text) => `\x1b[38;2;139;233;253m${text}\x1b[0m`,
};
export default async function statsCmd(options) {
	// Check if --reset flag is passed
	if (options && options.reset) {
		await resetStats();
		return;
	}

	// Check if --restore flag is passed
	if (options && options.restore) {
		await restoreStats();
		return;
	}

	// Display ASCII art banner at the start
	const orange = "\x1b[38;2;255;184;108m"; // Dracula orange
	const purple = "\x1b[38;2;189;147;249m"; // Dracula purple
	const reset = "\x1b[0m";

	console.log("\n");
	console.log(
		orange +
			"                                                 │█████████████" +
			reset
	);
	console.log(
		orange +
			"                                                   │██    │██" +
			reset
	);
	console.log(
		orange +
			"                                                   │██ │█ │██" +
			reset
	);
	console.log(
		orange +
			"                                                │███████████████" +
			reset
	);
	console.log(
		orange +
			"                                                   │██    │██" +
			reset
	);
	console.log(
		orange +
			"                                                   │██    │██" +
			reset
	);
	console.log(
		orange +
			"                                                   │██    │██" +
			reset
	);
	console.log(
		orange +
			"                                                   │██    │██" +
			reset
	);
	console.log("\n");
	console.log(
		purple +
			"     █████                      █████   ████            █████                █████████  █████       █████" +
			reset
	);
	console.log(
		purple +
			"    ░░███                      ░░███   ███░            ░░███                ███░░░░░███░░███       ░░███" +
			reset
	);
	console.log(
		purple +
			"  ███████   ██████  █████ █████ ░███  ███     ██████   ███████    ██████   ███     ░░░  ░███        ░███" +
			reset
	);
	console.log(
		purple +
			" ███░░███  ███░░███░░███ ░░███  ░███████     ░░░░░███ ░░░███░    ░░░░░███ ░███          ░███        ░███" +
			reset
	);
	console.log(
		purple +
			"░███ ░███ ░███████  ░███  ░███  ░███░░███     ███████   ░███      ███████ ░███          ░███        ░███" +
			reset
	);
	console.log(
		purple +
			"░███ ░███ ░███░░░   ░░███ ███   ░███ ░░███   ███░░███   ░███ ███ ███░░███ ░░███     ███ ░███      █ ░███" +
			reset
	);
	console.log(
		purple +
			"░░████████░░██████   ░░█████    █████ ░░████░░████████  ░░█████ ░░████████ ░░█████████  ███████████ █████" +
			reset
	);
	console.log(
		purple +
			" ░░░░░░░░  ░░░░░░     ░░░░░    ░░░░░   ░░░░  ░░░░░░░░    ░░░░░   ░░░░░░░░   ░░░░░░░░░  ░░░░░░░░░░░ ░░░░░" +
			reset
	);
	console.log("\n");

	intro(dracula.special("Your devKata Statistics"));

	// Ask for time period
	const timeRange = await select({
		message: dracula.info("Select time period:"),
		options: [
			{ value: 7, label: "Last 7 days" },
			{ value: 30, label: "Last 30 days" },
			{ value: 90, label: "Last 90 days" },
			{ value: "year", label: "This year (2025)" },
			{ value: null, label: "All time" },
		],
	});

	if (isCancel(timeRange)) {
		outro(dracula.error("Stats cancelled."));
		return;
	}

	// Fetch all logs
	const allLogs = await getAllLogs();

	if (allLogs.length === 0) {
		outro(
			dracula.info(
				"No kata history found yet. Start your first kata with `devkata start`!"
			)
		);
		return;
	}

	// Get sessions in range
	let sessions;
	let calendarStartDate = null;

	if (timeRange === "year") {
		// Filter sessions for current calendar year (Jan 1 - Dec 31)
		const currentYear = new Date().getFullYear();
		const yearStart = `${currentYear}-01-01`;
		const yearEnd = `${currentYear}-12-31`;

		sessions = allLogs
			.filter(
				(log) =>
					log.date >= yearStart && log.date <= yearEnd
			)
			.flatMap((log) => log.sessions);

		calendarStartDate = yearStart;
	} else {
		sessions = getSessionsInRange(allLogs, timeRange);
	}

	if (sessions.length === 0) {
		outro(
			dracula.info(
				`No katas completed in the selected time period.`
			)
		);
		return;
	}

	// Calculate all stats
	const totalKatas = calculateTotalKatas(sessions);
	const streak = calculateStreak(allLogs);
	const categoryStats = getCategoryStats(sessions);
	const articles = getArticlesRead(sessions);
	const repos = getReposReviewed(sessions);
	const avgDuration = calculateAverageDuration(sessions);

	// Calculate calendar weeks to show based on time range
	let weeksToShow = 12; // Default
	let calendarTitle = "Last 12 Weeks";

	if (timeRange === "year") {
		// For current year, calculate weeks from Jan 1 to today
		const jan1 = new Date(new Date().getFullYear(), 0, 1);
		const today = new Date();
		const daysSinceJan1 = Math.ceil(
			(today - jan1) / (1000 * 60 * 60 * 24)
		);
		weeksToShow = Math.ceil(daysSinceJan1 / 7) + 1; // +1 to include current week
		calendarTitle = `Year ${new Date().getFullYear()}`;
	} else if (timeRange) {
		if (timeRange <= 7) {
			weeksToShow = 2;
			calendarTitle = "Last 2 Weeks";
		} else if (timeRange <= 30) {
			weeksToShow = 5;
			calendarTitle = "Last 5 Weeks";
		} else if (timeRange <= 90) {
			weeksToShow = 13;
			calendarTitle = "Last 13 Weeks";
		}
	} else {
		// All time - show as many weeks as we have data
		if (allLogs.length > 0) {
			const oldestLog = allLogs.reduce((oldest, log) =>
				log.date < oldest.date ? log : oldest
			);
			const oldestDate = new Date(oldestLog.date);
			const today = new Date();
			const daysDiff = Math.ceil(
				(today - oldestDate) / (1000 * 60 * 60 * 24)
			);
			weeksToShow = Math.ceil(daysDiff / 7);
			calendarTitle = `All Time (${weeksToShow} weeks)`;
		}
	}

	// Display calendar heatmap
	console.log(
		dracula.special(
			`\n  Activity Calendar (${calendarTitle})`
		)
	);
	const calendarData = generateCalendarData(
		allLogs,
		weeksToShow,
		calendarStartDate
	);
	renderCalendar(calendarData);

	// Display overview stats
	displayOverviewStats(
		totalKatas,
		streak,
		timeRange,
		avgDuration,
		dracula
	);

	// Display category breakdown
	displayCategoryBreakdown(categoryStats, dracula);

	// Display resources
	displayResourcesList(articles, repos, dracula);

	outro(dracula.success("Keep up the great work!"));
}

/**
 * Display overview statistics
 */
function displayOverviewStats(
	totalKatas,
	streak,
	timeRange,
	avgDuration,
	dracula
) {
	console.log(dracula.special("\n  Overview"));
	console.log(dracula.dim("─".repeat(50)));

	const period =
		timeRange === "year"
			? `this year`
			: timeRange
			? `${timeRange} days`
			: "all time";
	console.log(
		`  ${dracula.green(
			"Total Katas Completed:"
		)} ${dracula.orange(totalKatas.toString())} (${period})`
	);
	console.log(
		`  ${dracula.pink("Current Streak:")} ${dracula.orange(
			streak.toString()
		)} ${streak === 1 ? "day" : "days"}`
	);

	if (avgDuration > 0) {
		console.log(
			`  ${dracula.cyan(
				"Average Duration:"
			)} ${dracula.orange(avgDuration.toString())} minutes`
		);
	}

	if (streak >= 7) {
		console.log(
			`  ${dracula.cyan("  └─ Amazing! You're on fire!")}`
		);
	} else if (streak >= 3) {
		console.log(
			`  ${dracula.cyan(
				"  └─ Great momentum! Keep it going!"
			)}`
		);
	}

	console.log("");
}

/**
 * Display category breakdown
 */
function displayCategoryBreakdown(categoryStats, dracula) {
	if (categoryStats.length === 0) return;

	console.log(
		dracula.special("  Most Practiced Categories")
	);
	console.log(dracula.dim("─".repeat(50)));

	const topCategories = categoryStats.slice(0, 5); // Show top 5
	const maxCount = topCategories[0].count;

	topCategories.forEach((cat, index) => {
		const barLength = Math.ceil(
			(cat.count / maxCount) * 30
		);
		const bar = "█".repeat(barLength);
		const prefix = index === 0 ? "* " : "  ";

		console.log(
			`  ${prefix}${dracula.cyan(
				cat.category.padEnd(15)
			)} ${dracula.purple(bar)} ${dracula.orange(
				cat.count.toString()
			)}`
		);
	});

	console.log("");
}

/**
 * Display articles and repos
 */
function displayResourcesList(articles, repos, dracula) {
	// Display articles
	if (articles.length > 0) {
		console.log(
			dracula.special(
				`  Articles Read (${articles.length})`
			)
		);
		console.log(dracula.dim("─".repeat(50)));

		articles.slice(0, 10).forEach((article) => {
			console.log(
				`  • ${dracula.cyan(article.title || "Untitled")}`
			);
			console.log(`    ${dracula.dim(article.url)}`);
		});

		if (articles.length > 10) {
			console.log(
				`  ${dracula.dim(
					`... and ${articles.length - 10} more`
				)}`
			);
		}
		console.log("");
	}

	// Display repos
	if (repos.length > 0) {
		console.log(
			dracula.special(
				`  Repositories Reviewed (${repos.length})`
			)
		);
		console.log(dracula.dim("─".repeat(50)));

		repos.slice(0, 10).forEach((repo) => {
			console.log(
				`  • ${dracula.green(
					repo.repoName || "Unnamed repo"
				)}`
			);
			console.log(`    ${dracula.dim(repo.repoUrl)}`);
		});

		if (repos.length > 10) {
			console.log(
				`  ${dracula.dim(
					`... and ${repos.length - 10} more`
				)}`
			);
		}
		console.log("");
	}
}
