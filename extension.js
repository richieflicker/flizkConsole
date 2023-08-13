// @ts-nocheck
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "flizkconsole" is now active!');

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
		if (language == "typescript" || language == "typescriptreact" || language == "javascript") {

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
		if (language == "typescript" || language == "typescriptreact" || language == "javascript") {
			commentConsoleLog()
		} else if (language == "php") {

		} else {
			vscode.window.showWarningMessage('There is Nothing to Comment ! ');
		}
	});
	vscode.commands.registerCommand('flizkConsole.removeLogMessage', function () {
		const editor = vscode.window.activeTextEditor;
		let language = editor.document.languageId;
		if (language == "typescript" || language == "typescriptreact" || language == "javascript") {
			commentConsoleLog(true)
		}
	})
	vscode.commands.registerCommand('flizkConsole.uncommentLogMessage', function () {
		// The code you place here will be executed every time your command is executed
		const editor = vscode.window.activeTextEditor;
		let language = editor.document.languageId;
		// console.log(`The current document's language is ${language}`);
		if (language == "typescript" || language == "typescriptreact" || language == "javascript") {
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
			vscode.window.showErrorMessage("Editor Does Not Exist");
			return;
		}

		const regex = /\/\/\s*console\.log\(([^)]*)\);|\/\*\s*console\.log\(([^)]*)\);\s*\*\/|#\s*console\.log\(([^)]*)\);/g;
		const visibleRange = editor.visibleRanges[0]; // Get the visible range of the editor

		// Create an array to hold the edited lines
		let editedLines = [];

		for (let i = visibleRange.start.line; i <= visibleRange.end.line; i++) {
			let line = editor.document.lineAt(i);
			let newText = line.text;
			// Check if the line is commented and contains a commented console.log statement
			if ((newText.trim().startsWith("//") || newText.trim().startsWith("/*") || newText.trim().startsWith("#")) && regex.test(newText)) {
				newText = newText.replace(regex, "console.log($1$2$3);"); // Uncomment the console.log statement
			}

			editedLines.push(newText);
		}

		// Apply the changes to the visible lines of the document
		editor.edit(editBuilder => {
			for (let i = visibleRange.start.line; i <= visibleRange.end.line; i++) {
				editBuilder.replace(editor.document.lineAt(i).range, editedLines[i - visibleRange.start.line]);
			}
		}).then(() => {
			vscode.window.showInformationMessage('Uncommented console.log statements in visible text.');
		}).catch(err => {
			console.error(err);
		});
	}
	function commentConsoleLog(removeLogs = false) {
		let editor = vscode.window.activeTextEditor;
	
		if (!editor) {
			vscode.window.showErrorMessage("Editor Does Not Exist");
			return;
		}
	
		let regex = /(?<!\/\/\s*)\bconsole\s*\.\s*log\(([^)]*)\);?/g; // Updated regex to capture everything inside the parentheses
		if (removeLogs) {
			regex = /(\/\/)?\s*console(\s*\.\s*log)?\(([^)]*)\);?/g;
		}
		const visibleRange = editor.visibleRanges[0]; // Get the visible range of the editor
	
		// Create an array to hold the edited lines
		let editedLines = [];
	
		for (let i = visibleRange.start.line; i <= visibleRange.end.line; i++) {
			let line = editor.document.lineAt(i);
			let newText = line.text;
	
			// Check if the line is not already commented and contains a console.log statement
			if (!removeLogs) {
				const matches = newText.match(regex);
				if (matches && !newText.trim().startsWith("//")) {
					for (const match of matches) {
						const replacement = `// ${match}`;
						newText = newText.replace(match, replacement);
					}
				}
			} else {
				const matches = newText.match(regex);
				// Remove the entire console.log statement including possible trailing );
				if (matches && !newText.trim().startsWith("//")) {
					newText = newText.replace(regex, "").replace(/\);?/g, "");
				}else if(newText.trim().startsWith("//")){
					newText = newText.replace(regex, "").replace(/\);?/g, "");
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
			vscode.window.showInformationMessage('Updated console.log statements in visible text.');
		}).catch(err => {
			console.error(err);
		});
	}
	
	
	function consoleLog() {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage("Editor Does Not Exist");
			return;
		}

		const document = editor.document;
		const cursorPosition = editor.selection.active;
		const currentLine = cursorPosition.line;
		const lastLine = document.lineCount - 1;

		const selection = editor.selection;
		const selectedText = document.getText(selection);
		if(selectedText){
			console.log(selectedText,'Text')
			// Find the end of the current function block
				const variableName = selectedText || 'variableName'; // Use selected text as variable name or provide a default name
				const snippet = `console.log('${variableName} :${currentLine}', ${variableName});\n`;
				const insertionPosition = new vscode.Position(currentLine + 1, 0);

				editor.edit(editBuilder => {
					editBuilder.insert(insertionPosition, snippet);
				}).then(() => {
					console.log("Log Added Successfully");
				}).catch(err => {
					vscode.window.showErrorMessage(`Error: ${err}`);
				});
			return;
		}

		// Find the last occurrence of '}' or '};' below the cursor position
		let objectEndLine = -1;
		for (let i = currentLine + 1; i <= lastLine; i++) {
			const lineText = document.lineAt(i).text.trim();
			if (lineText === '}' || lineText === '};') {
				objectEndLine = i;
				break;
			}
		}

		const currentLineText = document.lineAt(currentLine).text.trim();
		const match = currentLineText.match(/\b(const|let|var|function)\s+([\w$]+)/);
		if (!match) {
			vscode.window.showErrorMessage("No variable or function declaration found at cursor position.");
			return;
		}

		const variableName = match[2];
		const isFunction = match[1] === "function";
		const functionEnable = isFunction ? '()' : '';

		let snippet = `console.log('${variableName} :${currentLine}', ${variableName}${functionEnable});\n`;

		// Check if a console.log statement already exists for the variable or function
		// const existingLogLine = findExistingLogLine(document, variableName);
		// if (existingLogLine !== -1) {
		// 	vscode.window.showInformationMessage(`A console.log statement already exists for '${variableName}'.`);
		// 	return;
		// }

		if (!isFunction && objectEndLine !== -1) {
			snippet = `console.log('${variableName} :${currentLine}', ${variableName});\n`;
		}
		// Find the end of the current function block
		const functionEndLine = findFunctionEndLine(document, cursorPosition.line) + 1;
		console.log("Check Log", functionEndLine, objectEndLine, cursorPosition.line)
		const insertionPosition = new vscode.Position(isFunction ? functionEndLine + 1 : objectEndLine + 1, 0);

		editor.edit(editBuilder => {
			editBuilder.insert(insertionPosition, `${snippet}`);
		}).then(() => {
			console.log("Log Added Successfully");

		}).catch(err => {
			vscode.window.showErrorMessage(`Error: ${err}`);
		});
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
		vscode.commands.executeCommand("editor.action.insertLineAfter");
		vscode.commands.executeCommand("editor.action.insertSnippet", { "snippet": "\Log::info('${CLIPBOARD} :${TM_LINE_INDEX} '.${CLIPBOARD} $1)$2;" });
	}



	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
