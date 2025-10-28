#!/usr/bin/env node

import { program } from "commander";
import newCmd from "./commands/new.js";
import startCmd from "./commands/start.js";
import configCmd from "./commands/config.js";
import statsCmd from "./commands/stats.js";

program
	.name("devKata")
	.description(
		"A CLI tool to help you practice coding katas daily"
	)
	.version("1.1.0");

// Register commands
program
	.command("new")
	.description("Create kata routine")
	.action(newCmd);

program
	.command("start")
	.description("Start kata routine")
	.action(startCmd);

program
	.command("config")
	.description("Configure kata routine settings")
	.action(configCmd);

program
	.command("stats")
	.description("View your kata practice statistics")
	.option(
		"--reset",
		"Reset all statistics (WARNING: destructive operation)"
	)
	.option(
		"--restore",
		"Restore statistics from a previous backup"
	)
	.action(statsCmd);

program.parse();
