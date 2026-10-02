import fs from 'node:fs';
import {algebraBridge} from './suken-algebra-bridge-content.mjs';
fs.writeFileSync('data/suken-algebra-bridge.json',JSON.stringify(algebraBridge,null,2)+'\n');
console.log('Algebra bridge: 3 diagnostic questions, 4 lessons, 8 guided + 12 written questions.');
