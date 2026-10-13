function onOpen() {
    SpreadsheetApp.getUi().createMenu('CRM Notes')
        .addItem('Open Lead Notes', 'crmOpenNotes').addToUi();
}

function crmOpenNotes() {
    SpreadsheetApp.getUi().showSidebar(
        HtmlService.createHtmlOutputFromFile('CrmNotes').setTitle('Lead Notes'),
    );
}

function crmWithLock(action) {
    const lock = LockService.getDocumentLock();
    if (!lock.tryLock(10000)) throw new Error('Notes are busy. Please try again.');
    try {
        return action();
    } finally {
        lock.releaseLock();
    }
}

function crmNow() {
    return Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ss') + ' UTC';
}

function crmAuthor() {
    return Session.getActiveUser().getEmail() || 'Team Member';
}

function crmText(cell, value) {
    cell.setRichTextValue(SpreadsheetApp.newRichTextValue().setText(String(value)).build());
}

function crmFindLead(leadId) {
    if (typeof leadId !== 'string' || !leadId || leadId.length > 100) throw new Error('Invalid Lead ID.');
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
    if (!sheet || sheet.getRange(1, 1).getDisplayValue() !== 'Lead ID') throw new Error('The Leads schema is missing.');
    const matches = sheet.getDataRange().getDisplayValues().slice(1)
        .map((values, index) => ({ values, row: index + 2 }))
        .filter(item => item.values[0] === leadId);
    if (matches.length !== 1) throw new Error('Lead missing or duplicated. Reload the selected lead.');
    return { sheet, row: matches[0].row, id: leadId, name: matches[0].values[3] || 'Unnamed lead' };
}

function crmNotesSheet() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Notes');
    if (!sheet) throw new Error('The Notes tab is missing.');
    const headers = ['Lead ID', 'Timestamp', 'Author', 'Note Type', 'Note Text', 'Note ID', 'Edited On', 'Edited By'];
    const existing = sheet.getRange(1, 1, 1, 8).getDisplayValues()[0];
    if (existing.some((value, index) => value && value !== headers[index])) throw new Error('The Notes columns do not match the CRM schema.');
    sheet.getRange(1, 1, 1, 8).setValues([headers]);
    sheet.hideColumns(6);
    return sheet;
}

function crmPreview(lead) {
    if (lead.sheet.getMaxColumns() < 27) lead.sheet.insertColumnsAfter(lead.sheet.getMaxColumns(), 27 - lead.sheet.getMaxColumns());
    const header = lead.sheet.getRange(1, 27);
    if (header.getDisplayValue() && header.getDisplayValue() !== 'Latest Note') throw new Error('Column AA is already in use.');
    header.setValue('Latest Note');
    const row = lead.row;
    lead.sheet.getRange(row, 27).setFormula(
        '=IFERROR(LEFT(INDEX(SORT(FILTER({Notes!$B$2:$B,Notes!$E$2:$E,IF(Notes!$G$2:$G="",Notes!$B$2:$B,Notes!$G$2:$G),ROW(Notes!$A$2:$A)},Notes!$A$2:$A=$A' + row + '),3,FALSE,4,FALSE),1,2),180),"")',
    );
}

function crmNoteRows(sheet) {
    if (sheet.getLastRow() < 2) return [];
    return sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).getDisplayValues()
        .map((values, index) => ({ values, row: index + 2 }));
}

function crmLeadView(lead) {
    const sheet = crmNotesSheet();
    const rows = crmNoteRows(sheet);
    const seen = new Set();
    const notes = rows.reverse().filter(item => item.values[0] === lead.id).map(item => {
        if (!item.values[5]) {
            item.values[5] = Utilities.getUuid();
            crmText(sheet.getRange(item.row, 6), item.values[5]);
        }
        if (seen.has(item.values[5])) throw new Error('Duplicate Note IDs. Check the Notes tab before editing.');
        seen.add(item.values[5]);
        return {
            id: item.values[5], createdOn: item.values[1], author: item.values[2], type: item.values[3],
            text: item.values[4], editedOn: item.values[6], editedBy: item.values[7],
            editable: item.values[3] === 'Manual',
        };
    });
    crmPreview(lead);
    notes.sort((first, second) => (second.editedOn || second.createdOn).localeCompare(first.editedOn || first.createdOn));
    return { id: lead.id, name: lead.name, notes };
}

function crmGetSelectedLeadNotes() {
    return crmWithLock(() => {
        const selected = SpreadsheetApp.getActiveSpreadsheet().getActiveRange();
        if (!selected || selected.getSheet().getName() !== 'Leads' || selected.getRow() < 2 || selected.getNumRows() !== 1) {
            throw new Error('Select one lead row in the Leads tab, then load it.');
        }
        const leadId = selected.getSheet().getRange(selected.getRow(), 1).getDisplayValue();
        return crmLeadView(crmFindLead(leadId));
    });
}

function crmGetLeadNotes(leadId) {
    return crmWithLock(() => crmLeadView(crmFindLead(leadId)));
}

function crmSaveLeadNote(input) {
    return crmWithLock(() => {
        if (!input || typeof input.text !== 'string' || !input.text.trim() || input.text.length > 10000) {
            throw new Error('Enter a note between 1 and 10,000 characters.');
        }
        if (typeof input.noteId !== 'string' || !/^[a-f0-9-]{36}$/i.test(input.noteId)) throw new Error('Invalid Note ID.');
        const lead = crmFindLead(input.leadId);
        const sheet = crmNotesSheet();
        const rows = crmNoteRows(sheet).filter(item => item.values[5] === input.noteId);
        if (rows.length > 1 || (rows[0] && rows[0].values[0] !== lead.id)) throw new Error('Note identity conflict. Reload before editing.');
        const text = input.text.trim();
        const now = crmNow();
        const author = crmAuthor();
        if (input.mode === 'edit') {
            const current = rows[0];
            if (!current || current.values[3] !== 'Manual') throw new Error('Only existing manual notes can be edited.');
            if (input.expectedText !== current.values[4] || input.expectedEditedOn !== current.values[6]) {
                throw new Error('Someone changed this note. Reload the notes before editing again.');
            }
            crmText(sheet.getRange(current.row, 5), text);
            crmText(sheet.getRange(current.row, 7), now);
            crmText(sheet.getRange(current.row, 8), author);
        } else if (input.mode === 'add') {
            if (rows[0]) {
                if (rows[0].values[3] !== 'Manual' || rows[0].values[4] !== text) throw new Error('This note request was already used. Reload the notes.');
                return crmLeadView(lead);
            }
            const row = sheet.getLastRow() + 1;
            [lead.id, now, author, 'Manual', text, input.noteId, '', ''].forEach((value, index) => {
                crmText(sheet.getRange(row, index + 1), value);
            });
        } else {
            throw new Error('Invalid note action.');
        }
        crmText(lead.sheet.getRange(lead.row, 3), now);
        return crmLeadView(lead);
    });
}