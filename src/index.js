#!/usr/bin/env node

import { program } from 'commander';
import newCmd from './commands/new.js';
import startCmd from './commands/start.js';

program
    .command('new')
    .description('Create kata routine')
    .action(newCmd);
    
program
    .command('start')
    .description('Start kata routine')
    .action(startCmd);

    program.parse();