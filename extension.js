// @ts-nocheck
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// Output channel for detailed logging
let outputChannel;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Create output channel for detailed logging
	outputChannel = vscode.window.createOutputChannel('flizkConsole');
	outputChannel.appendLine('flizkConsole extension activated');

	// Helper function to show status messages based on configuration
	function showStatusMessage(message, type = 'info') {
		const config = vscode.workspace.getConfiguration('flizkConsole');
		const showMessages = config.get('showStatusMessages', true);
		
		if (showMessages) {
			if (type === 'info') {
				vscode.window.showInformationMessage(message);
			} else if (type === 'warning') {
				vscode.window.showWarningMessage(message);
			} else if (type === 'error') {
				vscode.window.showErrorMessage(message);
			}
		}
		
		// Always log to output channel
		outputChannel.appendLine(`[${type.toUpperCase()}] ${message}`);
	}

	// Helper function to get log template
	function getLogTemplate(variableName, lineNumber) {
		const config = vscode.workspace.getConfiguration('flizkConsole');
		const logFormat = config.get('logFormat', 'simple');
		const includeTimestamp = config.get('includeTimestamp', false);
		const customTemplate = config.get('logTemplate', '${variableName} :${lineNumber}');
		
		let template;
		
		if (logFormat === 'custom') {
			template = customTemplate;
		} else if (logFormat === 'detailed') {
			template = includeTimestamp 
				? `[${new Date().toISOString()}] ${variableName} (line ${lineNumber})`
				: `${variableName} (line ${lineNumber})`;
		} else { // simple
			template = includeTimestamp
				? `[${new Date().toISOString()}] ${variableName} :${lineNumber}`
				: `${variableName} :${lineNumber}`;
		}
		
		// Replace template variables
		return template
			.replace(/\${variableName}/g, variableName)
			.replace(/\${lineNumber}/g, lineNumber)
			.replace(/\${timestamp}/g, new Date().toISOString());
	}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposables = vscode.commands.registerCommand('flizkconsole.helloWorld', function () {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from flizkConsole!');
	// });

	let disposable = vscode.commands.registerCommand('flizkConsole.displayLogMessage', function () {
		// The code you place here will be executed every time your command is executed
		const editor = vscode.window.activeTextEditor;
		// const lineText = editor.document.lineAt(editor.selection.active.line).text;


		// // console.log(lineText.replace("="," "))
		// let selectedText = editor.document.getText(editor.selection);
		// vscode.env.clipboard.writeText(selectedText)
		// // console.log(editor.document.getText())
		let language = editor.document.languageId;
		// console.log(`The current document's language is ${language}`);
		if (language == "typescript" || language == "typescriptreact" || language == "javascript" || language=="javascriptreact") {

			consoleLog()
			// vscode.window.showInformationMessage('Added Log from flizkConsole! ', selectedText);

		} else if (language == "php") {
			consoleLogPhp()
			// vscode.window.showInformationMessage('Added Log from flizkConsole! ', selectedText);

		} else {
			vscode.window.showWarningMessage('Have not added log ! ');
		}
	});
	vscode.commands.registerCommand('flizkConsole.commentLogMessage', function () {
		// The code you place here will be executed every time your command is executed
		const editor = vscode.window.activeTextEditor;
		let language = editor.document.languageId;
		// console.log(`The current document's language is ${language}`);
		if (language == "typescript" || language == "typescriptreact" || language == "javascript" || language=="javascriptreact") {
			commentConsoleLog()
		} else if (language == "php") {

		} else {
			vscode.window.showWarningMessage('There is Nothing to Comment ! ');
		}
	});
	vscode.commands.registerCommand('flizkConsole.removeLogMessage', function () {
		const editor = vscode.window.activeTextEditor;
		
		if (!editor) {
			showStatusMessage('No active editor found. Please open a file first.', 'error');
			return;
		}
		
		let language = editor.document.languageId;
		outputChannel.appendLine(`Processing removeLogMessage for language: ${language}`);
		
		if (language == "typescript" || language == "typescriptreact" || language == "javascript" || language=="javascriptreact") {
			commentConsoleLog(true);
		} else {
			showStatusMessage(`Console log removal is not supported for ${language} files.`, 'warning');
		}
	});
	vscode.commands.registerCommand('flizkConsole.uncommentLogMessage', function () {
		// The code you place here will be executed every time your command is executed
		const editor = vscode.window.activeTextEditor;
		let language = editor.document.languageId;
		// console.log(`The current document's language is ${language}`);
		if (language == "typescript" || language == "typescriptreact" || language == "javascript" || language=="javascriptreact") {
			uncommentConsoleLog()
			vscode.window.showInformationMessage('uncommented console.log from flizkConsole! ');

		} else if (language == "php") {

		} else {
			vscode.window.showWarningMessage('There is Nothing to Comment ! ');
		}
		// Display a message box to the user

	});
	function uncommentConsoleLog() {
		let editor = vscode.window.activeTextEditor;

		if (!editor) {
			showStatusMessage('No active editor found.', 'error');
			return;
		}

		const regex = /\/\/\s*console\.log\(([^)]*)\);|\/\*\s*console\.log\(([^)]*)\);\s*\*\/|#\s*console\.log\(([^)]*)\);/g;
		const visibleRange = editor.visibleRanges[0]; // Get the visible range of the editor

		// Create an array to hold the edited lines
		let editedLines = [];
		let uncommentedCount = 0;

		for (let i = visibleRange.start.line; i <= visibleRange.end.line; i++) {
			let line = editor.document.lineAt(i);
			let newText = line.text;
			const originalText = newText;
			
			// Check if the line is commented and contains a commented console.log statement
			if ((newText.trim().startsWith("//") || newText.trim().startsWith("/*") || newText.trim().startsWith("#")) && regex.test(newText)) {
				newText = newText.replace(regex, "console.log($1$2$3);"); // Uncomment the console.log statement
				if (newText !== originalText) {
					uncommentedCount++;
				}
			}

			editedLines.push(newText);
		}

		// Apply the changes to the visible lines of the document
		editor.edit(editBuilder => {
			for (let i = visibleRange.start.line; i <= visibleRange.end.line; i++) {
				editBuilder.replace(editor.document.lineAt(i).range, editedLines[i - visibleRange.start.line]);
			}
		}).then(() => {
			if (uncommentedCount > 0) {
				showStatusMessage(`Uncommented ${uncommentedCount} console.log statement(s) in visible area.`);
			} else {
				showStatusMessage('No commented console.log statements found in visible area.', 'warning');
			}
		}).catch(err => {
			outputChannel.appendLine(`Error uncommenting console.log: ${err.message}`);
			showStatusMessage(`Failed to uncomment console.log statements: ${err.message}`, 'error');
		});
	}
	function commentConsoleLog(removeLogs = false) {
		let editor = vscode.window.activeTextEditor;

		if (!editor) {
			showStatusMessage('No active editor found.', 'error');
			return;
		}

		let regex = /(?<!\/\/\s*)\bconsole\s*\.\s*log\(([^)]*)\);?/g; // Updated regex to capture everything inside the parentheses
		if (removeLogs) {
			regex = /(\/\/)?\s*console(\s*\.\s*log)?\(([^)]*)\);?/g;
		}
		const visibleRange = editor.visibleRanges[0]; // Get the visible range of the editor

		// Create an array to hold the edited lines
		let editedLines = [];
		let actionCount = 0;

		for (let i = visibleRange.start.line; i <= visibleRange.end.line; i++) {
			let line = editor.document.lineAt(i);
			let newText = line.text;
			const originalText = newText;

			// Check if the line is not already commented and contains a console.log statement
			if (!removeLogs) {
				const matches = newText.match(regex);
				if (matches && !newText.trim().startsWith("//")) {
					for (const match of matches) {
						const replacement = `// ${match}`;
						newText = newText.replace(match, replacement);
						actionCount++;
					}
				}
			} else {
				const matches = newText.match(regex);
				// Remove the entire console.log statement including possible trailing );
				if (matches && !newText.trim().startsWith("//")) {
					newText = newText.replace(regex, "").replace(/\);?/g, "");
					if (newText !== originalText) {
						actionCount++;
					}
				} else if (newText.trim().startsWith("//")) {
					newText = newText.replace(regex, "").replace(/\);?/g, "");
					if (newText !== originalText) {
						actionCount++;
					}
				}
			}

			editedLines.push(newText);
		}

		// Apply the changes to the visible lines of the document
		editor.edit(editBuilder => {
			for (let i = visibleRange.start.line; i <= visibleRange.end.line; i++) {
				editBuilder.replace(editor.document.lineAt(i).range, editedLines[i - visibleRange.start.line]);
			}
		}).then(() => {
			if (actionCount > 0) {
				const action = removeLogs ? 'removed' : 'commented';
				showStatusMessage(`${actionCount} console.log statement(s) ${action} in visible area.`);
			} else {
				const action = removeLogs ? 'remove' : 'comment';
				showStatusMessage(`No console.log statements found to ${action} in visible area.`, 'warning');
			}
		}).catch(err => {
			outputChannel.appendLine(`Error ${removeLogs ? 'removing' : 'commenting'} console.log: ${err.message}`);
			showStatusMessage(`Failed to ${removeLogs ? 'remove' : 'comment'} console.log statements: ${err.message}`, 'error');
		});
	}


	function consoleLog() {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			showStatusMessage('No active editor found.', 'error');
			return;
		}

		const document = editor.document;
		const cursorPosition = editor.selection.active;
		const currentLine = cursorPosition.line;
		const lastLine = document.lineCount - 1;

		const selection = editor.selection;
		const selectedText = document.getText(selection);
		if (selectedText) {
			outputChannel.appendLine(`Selected text: ${selectedText}`);
			// Find the end of the current function block
			const variableName = selectedText.trim() || 'variableName'; // Use selected text as variable name or provide a default name
			const logLabel = getLogTemplate(variableName, currentLine + 1);
			const snippet = `console.log('${logLabel}', ${variableName});\n`;
			const insertionPosition = new vscode.Position(currentLine + 1, 0);

			editor.edit(editBuilder => {
				editBuilder.insert(insertionPosition, snippet);
			}).then(() => {
				showStatusMessage(`Console log added for "${variableName}"`);
				outputChannel.appendLine(`Log added successfully for variable: ${variableName}`);
			}).catch(err => {
				outputChannel.appendLine(`Error adding log: ${err.message}`);
				showStatusMessage(`Failed to add console log: ${err.message}`, 'error');
			});
			return;
		} else {
			// Find the last occurrence of '}' or '};' below the cursor position
			let objectEndLine = -1;
			for (let i = currentLine + 1; i <= lastLine; i++) {
				const lineText = document.lineAt(i).text.trim();
				if(document.lineAt(currentLine).text.trim().endsWith('{')){
					if (lineText === '}' || lineText === '};') {
						objectEndLine = i;
						break;
					}
				}else{
					objectEndLine=currentLine;
					break;
				}
				
			}

			const currentLineText = document.lineAt(currentLine).text.trim();
			const match = currentLineText.match(/\b(const|let|var|function)\s+([\w$]+)/);
			if (!match) {
				showStatusMessage('No variable or function declaration found at cursor position. Please place your cursor on a variable or function declaration, or select text to log.', 'warning');
				return;
			}

			const variableName = match[2];
			const isFunction = match[1] === "function";
			const functionEnable = isFunction ? '()' : '';

			if(objectEndLine===-1){
				objectEndLine=cursorPosition.line+1
			}
			// Find the end of the current function block
			const functionEndLine = findFunctionEndLine(document, cursorPosition.line);
			const insertionLine = isFunction ? (functionEndLine !== undefined ? functionEndLine + 1 : currentLine + 1) : objectEndLine + 1;
			const logLabel = getLogTemplate(variableName, insertionLine);
			
			let snippet = `console.log('${logLabel}', ${variableName}${functionEnable});\n`;

			const insertionPosition = new vscode.Position(insertionLine, 0);

			editor.edit(editBuilder => {
				editBuilder.insert(insertionPosition, `${snippet}`);
			}).then(() => {
				showStatusMessage(`Console log added for "${variableName}"`);
				outputChannel.appendLine(`Log added successfully for ${isFunction ? 'function' : 'variable'}: ${variableName} at line ${insertionLine}`);
			}).catch(err => {
				outputChannel.appendLine(`Error adding log: ${err.message}`);
				showStatusMessage(`Failed to add console log: ${err.message}`, 'error');
			});
		}


	}
	// This Function helps to find a log existing line 
	// function findExistingLogLine(document, variableName) {
	// 	for (let i = 0; i < document.lineCount; i++) {
	// 		const lineText = document.lineAt(i).text;
	// 		if (lineText.includes(`console.log('${variableName} :`)) {
	// 			return i;
	// 		}
	// 	}
	// 	return -1;
	// }
	function findFunctionEndLine(document, startLine) {
		const totalLines = document.lineCount;
		let braceCount = 0;

		for (let line = startLine; line < totalLines; line++) {
			const lineText = document.lineAt(line).text;

			for (const char of lineText) {
				if (char === '{') {
					braceCount++;
				} else if (char === '}') {
					braceCount--;
					if (braceCount === 0) {
						return line;
					}
				}
			}
		}

	}


	function consoleLogPhp() {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			showStatusMessage('No active editor found.', 'error');
			return;
		}
		
		const cursorPosition = editor.selection.active;
		const currentLine = cursorPosition.line;
		const selection = editor.selection;
		const selectedText = editor.document.getText(selection);
		const variableName = selectedText.trim() || 'variable';
		const logLabel = getLogTemplate(variableName, currentLine + 1);
		
		vscode.commands.executeCommand("editor.action.insertLineAfter").then(() => {
			vscode.commands.executeCommand("editor.action.insertSnippet", { 
				"snippet": `Log::info('${logLabel} '.${variableName} $1)$2;` 
			}).then(() => {
				showStatusMessage(`PHP log added for "${variableName}"`);
				outputChannel.appendLine(`PHP log added successfully for: ${variableName}`);
			}).catch(err => {
				outputChannel.appendLine(`Error adding PHP log: ${err.message}`);
				showStatusMessage(`Failed to add PHP log: ${err.message}`, 'error');
			});
		}).catch(err => {
			outputChannel.appendLine(`Error inserting line: ${err.message}`);
			showStatusMessage(`Failed to add PHP log: ${err.message}`, 'error');
		});
	}



	context.subscriptions.push(disposable);
	context.subscriptions.push(outputChannel);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
