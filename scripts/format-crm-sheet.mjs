import dotenv from 'dotenv';
import { formatCrmSheet } from '../api/_lib/sheets.js';

dotenv.config({ quiet: true });

try {
    const result = await formatCrmSheet();
    console.log(JSON.stringify(result));
} catch (error) {
    console.error('CRM formatting failed:', error.message);
    process.exitCode = 1;
}