const fs = require('fs');
const { execSync } = require('child_process');

const dates = {
    1: ["2026-05-19", "2026-05-20"],
    2: ["2026-05-21", "2026-05-22"],
    3: ["2026-05-21", "2026-05-22"],
    4: ["2026-05-22", "2026-05-23"],
    5: ["2026-05-19", "2026-05-20"],
    6: ["2026-05-19", "2026-05-20"],
    7: ["2026-05-19", "2026-05-20"],
    8: ["2026-05-21", "2026-05-23"],
    9: ["2026-05-23", "2026-05-25"],
    10: ["2026-05-19", "2026-05-22"],
    11: ["2026-05-22", "2026-05-23"],
    12: ["2026-05-21", "2026-05-22"],
    13: ["2026-05-21", "2026-05-22"],
    14: ["2026-05-21", "2026-05-22"],
    15: ["2026-05-23", "2026-05-25"],
    16: ["2026-05-21", "2026-05-22"],
    17: ["2026-05-24", "2026-05-26"],
    18: ["2026-05-21", "2026-05-22"],
    19: ["2026-05-26", "2026-05-27"],
    20: ["2026-05-24", "2026-05-25"],
    21: ["2026-05-23", "2026-05-24"],
    22: ["2026-05-25", "2026-05-26"],
    23: ["2026-05-23", "2026-05-24"],
    24: ["2026-05-25", "2026-05-26"],
    25: ["2026-05-24", "2026-05-25"],
    26: ["2026-05-28", "2026-05-29"],
    27: ["2026-05-26", "2026-05-27"],
    28: ["2026-05-26", "2026-05-27"],
    29: ["2026-05-26", "2026-05-27"],
    30: ["2026-05-30", "2026-06-02"]
};

const projectId = "PVT_kwHOEGxidc4BX4Fr";
const startDateFieldId = "PVTF_lAHOEGxidc4BX4FrzhTB7iA";
const targetDateFieldId = "PVTF_lAHOEGxidc4BX4FrzhTB7iE";
const statusFieldId = "PVTSSF_lAHOEGxidc4BX4FrzhTB65A";
const todoOptionId = "f75ad846";

console.log("Fetching project items...");
const stdout = execSync('gh project item-list 2 --owner proilisys-byte --format json', { encoding: 'utf-8' });
const data = JSON.parse(stdout);

for (const item of data.items) {
    if (!item.content || !item.content.url) continue;
    const match = item.content.url.match(/\/issues\/(\d+)$/);
    if (match) {
        const issueNum = parseInt(match[1], 10);
        if (dates[issueNum]) {
            const [startDate, targetDate] = dates[issueNum];
            console.log(`Setting dates for Issue #${issueNum} (${startDate} ~ ${targetDate})...`);
            
            try {
                execSync(`gh project item-edit --project-id ${projectId} --id ${item.id} --field-id ${startDateFieldId} --date ${startDate}`);
                execSync(`gh project item-edit --project-id ${projectId} --id ${item.id} --field-id ${targetDateFieldId} --date ${targetDate}`);
                execSync(`gh project item-edit --project-id ${projectId} --id ${item.id} --field-id ${statusFieldId} --single-select-option-id ${todoOptionId}`);
            } catch (err) {
                console.error(`Failed to update Issue #${issueNum}`, err.message);
            }
        }
    }
}
console.log("Done");
