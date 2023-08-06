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
		const lineText = editor.document.lineAt(editor.selection.active.line).text;
		
		
		// console.log(lineText.replace("="," "))
		let selectedText = editor.document.getText(editor.selection);
		vscode.env.clipboard.writeText(selectedText)
		// console.log(editor.document.getText())
		let language = editor.document.languageId;
		// console.log(`The current document's language is ${language}`);
		if (language == "typescript" || language == "typescriptreact" || language == "javascript") {
			console.log('lineText :31 ', editor.document.getText );
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
 
		}else {
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

		}else {
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
	function commentConsoleLog(removeLogs=false) {
		let editor = vscode.window.activeTextEditor;
	
		if (!editor) {
			vscode.window.showErrorMessage("Editor Does Not Exist");
			return;
		}
	
		const regex = /console\.log\(([^)]*)\);/g; // Updated regex to capture everything inside the parentheses
		const visibleRange = editor.visibleRanges[0]; // Get the visible range of the editor
	
		// Create an array to hold the edited lines
		let editedLines = [];
	
		for (let i = visibleRange.start.line; i <= visibleRange.end.line; i++) {
			let line = editor.document.lineAt(i);
			let newText = line.text;
			let conditons,setNew
			// Check if the line is not already commented and contains a console.log statement
			if (!removeLogs) {
				conditons=regex.test(newText) && !newText.trim().startsWith("//");
				setNew=newText.replace(regex, "// console.log($1);");
			}else{
				conditons=regex.test(newText)
				setNew=newText.replace(regex, "")
			}
			if (conditons) {
				console.log(removeLogs,"Logs")
				newText = setNew; // Comment out the console.log statement
			}
			editedLines.push(newText);
		}
	
		// Apply the changes to the visible lines of the document
		editor.edit(editBuilder => {
			for (let i = visibleRange.start.line; i <= visibleRange.end.line; i++) {
				editBuilder.replace(editor.document.lineAt(i).range, editedLines[i - visibleRange.start.line]);
			}
		}).then(() => {
			vscode.window.showInformationMessage('Commented console.log statements in visible text.');
		}).catch(err => {
			console.error(err);
		});
	}
	function consoleLog() {
		vscode.commands.executeCommand("editor.action.insertLineAfter");
		vscode.commands.executeCommand("editor.action.insertSnippet", { "snippet": "console.log('${CLIPBOARD} :${TM_LINE_INDEX} ', ${CLIPBOARD} $1)$2;" });
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
