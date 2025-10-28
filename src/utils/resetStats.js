import {
	intro,
	outro,
	text,
	confirm,
	isCancel,
	select,
} from "@clack/prompts";
import pc from "picocolors";
import fs from "fs/promises";
import path from "path";
import os from "os";

const dracula = {
	success: (text) => pc.green(text),
	error: (text) => pc.red(text),
	info: (text) => pc.yellow(text),
	special: (text) => pc.magenta(text),
	dim: (text) => pc.dim(text),
};

const logsDir = path.join(
	os.homedir(),
	".config",
	"devKata",
	"logs"
);

// Reset all statistics by deleting the logs directory
// This is a DESTRUCTIVE operation with multiple confirmation steps
export async function resetStats() {
	intro(dracula.error("WARNING: Reset All Statistics"));

	// Display what will be deleted
	console.log("\n");
	console.log(
		dracula.error("  This will PERMANENTLY DELETE:")
	);
	console.log(
		dracula.dim(
			"  ────────────────────────────────────────"
		)
	);
	console.log(
		`  ${dracula.info("•")} All kata completion history`
	);
	console.log(`  ${dracula.info("•")} All streak records`);
	console.log(
		`  ${dracula.info("•")} All task completion logs`
	);
	console.log(`  ${dracula.info("•")} All timing data`);
	console.log(
		`  ${dracula.info(
			"•"
		)} Articles read and repos reviewed`
	);
	console.log("\n");
	console.log(
		dracula.error("  This action CANNOT be undone!")
	);
	console.log(dracula.dim(`  Location: ${logsDir}`));
	console.log("\n");

	// Check if logs directory exists
	let hasData = false;
	try {
		await fs.access(logsDir);
		const files = await fs.readdir(logsDir);
		const logFiles = files.filter((f) =>
			f.startsWith("kataLog_")
		);

		if (logFiles.length > 0) {
			hasData = true;
			console.log(
				dracula.info(
					`  Found ${logFiles.length} log file(s) to delete`
				)
			);
			console.log("\n");
		} else {
			outro(
				dracula.info(
					"No statistics data found. Nothing to reset."
				)
			);
			return;
		}
	} catch (error) {
		if (error.code === "ENOENT") {
			outro(
				dracula.info(
					"No statistics data found. Nothing to reset."
				)
			);
			return;
		} else {
			outro(
				dracula.error(
					`Error accessing logs: ${error.message}`
				)
			);
			return;
		}
	}

	// First confirmation: typed text
	const confirmText = await text({
		message: dracula.error(
			'Type "DELETE MY DATA" to confirm (case-sensitive):'
		),
		validate: (value) => {
			if (value !== "DELETE MY DATA") {
				return "Confirmation text does not match. Must be exactly: DELETE MY DATA";
			}
		},
	});

	if (isCancel(confirmText)) {
		outro(
			dracula.info("Reset cancelled. Your data is safe <3")
		);
		return;
	}

	// Second confirmation: yes/no
	const finalConfirm = await confirm({
		message: dracula.error(
			"Are you absolutely sure you want to delete all statistics?"
		),
	});

	if (isCancel(finalConfirm) || !finalConfirm) {
		outro(
			dracula.info("Reset cancelled. Your data is safe <3")
		);
		return;
	}

	// Before deleting, offer to create a backup
	const backup = await confirm({
		message: "Create a backup before deleting?",
	});

	if (backup) {
		const backupDir = path.join(
			os.homedir(),
			".config",
			"devKata",
			"logs_backup_" + Date.now()
		);
		await fs.cp(logsDir, backupDir, { recursive: true });
		console.log(`Backup created: ${backupDir}`);
	}

	// Perform the deletion
	try {
		console.log("\n");
		console.log(
			dracula.dim("  Deleting logs directory...")
		);

		// Delete the entire logs directory
		await fs.rm(logsDir, { recursive: true, force: true });

		console.log(
			dracula.success("  ✓ Logs directory deleted")
		);
		console.log("\n");

		outro(
			dracula.success(
				"All statistics have been reset. Start fresh with your next kata!"
			)
		);
	} catch (error) {
		console.log("\n");
		outro(
			dracula.error(
				`Failed to delete logs: ${error.message}`
			)
		);
	}
}

// Restore statistics from a backup directory
export async function restoreStats() {
	intro(dracula.info("Restore Statistics from Backup"));

	const configDir = path.join(
		os.homedir(),
		".config",
		"devKata"
	);

	// Scan for backup directories
	let backupDirs = [];
	try {
		const entries = await fs.readdir(configDir, {
			withFileTypes: true,
		});
		backupDirs = entries
			.filter(
				(entry) =>
					entry.isDirectory() &&
					entry.name.startsWith("logs_backup_")
			)
			.map((entry) => entry.name);
	} catch (error) {
		outro(
			dracula.error(
				`Error scanning for backups: ${error.message}`
			)
		);
		return;
	}

	if (backupDirs.length === 0) {
		outro(
			dracula.info(
				"No backups found. Create a backup using 'devkata stats --reset' and choosing to backup."
			)
		);
		return;
	}

	// Sort by timestamp (newest first)
	backupDirs.sort().reverse();

	// Get file counts and format options
	const backupOptions = await Promise.all(
		backupDirs.map(async (dirName) => {
			const fullPath = path.join(configDir, dirName);
			const timestamp = dirName.replace("logs_backup_", "");
			const date = new Date(parseInt(timestamp));
			const formattedDate = date.toLocaleString();

			let fileCount = 0;
			try {
				const files = await fs.readdir(fullPath);
				fileCount = files.filter((f) =>
					f.startsWith("kataLog_")
				).length;
			} catch (error) {
				// Skip if can't read
			}

			return {
				value: dirName,
				label: `${formattedDate} (${fileCount} log files)`,
				hint: fullPath,
			};
		})
	);

	console.log("\n");
	console.log(
		dracula.dim(`  Found ${backupDirs.length} backup(s)`)
	);
	console.log("\n");

	// Let user select backup
	const selectedBackup = await select({
		message: "Select a backup to restore:",
		options: backupOptions,
	});

	if (isCancel(selectedBackup)) {
		outro(dracula.info("Restore cancelled"));
		return;
	}

	const backupPath = path.join(configDir, selectedBackup);

	// Check if current logs exist
	let currentLogsExist = false;
	try {
		await fs.access(logsDir);
		const files = await fs.readdir(logsDir);
		currentLogsExist =
			files.filter((f) => f.startsWith("kataLog_")).length >
			0;
	} catch (error) {
		// No current logs
	}

	// Warn if current logs exist
	if (currentLogsExist) {
		console.log("\n");
		console.log(
			dracula.error(
				"  WARNING: You have existing statistics data!"
			)
		);
		console.log(
			dracula.dim(
				"  Restoring will REPLACE all current data."
			)
		);
		console.log("\n");

		const replaceConfirm = await confirm({
			message: dracula.error(
				"Replace current statistics with this backup?"
			),
		});

		if (isCancel(replaceConfirm) || !replaceConfirm) {
			outro(dracula.info("Restore cancelled"));
			return;
		}

		// Delete current logs
		try {
			await fs.rm(logsDir, {
				recursive: true,
				force: true,
			});
		} catch (error) {
			outro(
				dracula.error(
					`Failed to delete current logs: ${error.message}`
				)
			);
			return;
		}
	} else {
		const restoreConfirm = await confirm({
			message: "Restore this backup?",
		});

		if (isCancel(restoreConfirm) || !restoreConfirm) {
			outro(dracula.info("Restore cancelled"));
			return;
		}
	}

	// Perform the restore
	try {
		console.log("\n");
		console.log(dracula.dim("  Restoring from backup..."));

		// Copy backup to logs directory
		await fs.cp(backupPath, logsDir, {
			recursive: true,
		});

		// Count restored files
		const restoredFiles = await fs.readdir(logsDir);
		const logCount = restoredFiles.filter((f) =>
			f.startsWith("kataLog_")
		).length;

		console.log(
			dracula.success(
				`  ✓ Restored ${logCount} log file(s)`
			)
		);
		console.log("\n");

		outro(
			dracula.success(
				"Statistics restored successfully! Run 'devkata stats' to view."
			)
		);
	} catch (error) {
		console.log("\n");
		outro(
			dracula.error(
				`Failed to restore backup: ${error.message}`
			)
		);
	}
}
