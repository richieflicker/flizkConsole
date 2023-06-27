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
			consoleLog()
			vscode.window.showInformationMessage('Added Log from flizkConsole! ', selectedText);

		} else if (language == "php") {
			consoleLogPhp()
			vscode.window.showInformationMessage('Added Log from flizkConsole! ', selectedText);

		} else {
			vscode.window.showWarningMessage('Have not added log ! ');
		}
		// Display a message box to the user

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
		// Display a message box to the user

	});
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
	function uncommentConsoleLog(){
		let editor = vscode.window.activeTextEditor;
		const textEditor = vscode.window.activeTextEditor;
		if (!textEditor) {
			vscode.window.showErrorMessage("Editor Does Not Exist");
			return;
		}
		const regex = /\b^[//console]\b/gm;

		let textReplace = [];
		let invalidRange = new vscode.Range(0, 0, editor.document.lineCount, 0);
		let validFullRange = editor.document.validateRange(invalidRange);
		let doc = vscode.window.activeTextEditor.document;

		editor.edit(editBuilder => {
		for(var i=0;i<doc.lineCount;i++)
		{
			var line = doc.lineAt(i);
			var getText=[]
			line.text.split(' ').forEach(function(i){
				if(regex.test(i)){
				getText.push("//"+i)
				}else{
					getText.push(i)
				}
			})
			textReplace.push(getText.join(" "))

		}
			editBuilder.replace(validFullRange, textReplace.join("\n"));
			vscode.window.showInformationMessage('Commented console.log from flizkConsole! ') 
		}).catch(err => console.log(err));
	}
	function commentConsoleLog() {
		let editor = vscode.window.activeTextEditor;
		const textEditor = vscode.window.activeTextEditor;
		if (!textEditor) {
			vscode.window.showErrorMessage("Editor Does Not Exist");
			return;
		}
		const regex = /\b^console\b/gm;

		let textReplace = [];
		let invalidRange = new vscode.Range(0, 0, editor.document.lineCount, 0);
		let validFullRange = editor.document.validateRange(invalidRange);
		let doc = vscode.window.activeTextEditor.document;

		editor.edit(editBuilder => {
		for(var i=0;i<doc.lineCount;i++)
		{
			var line = doc.lineAt(i);
			var getText=[]
			line.text.split(' ').forEach(function(i){
				if(regex.test(i)){
				getText.push("//"+i)
				}else{
					getText.push(i)
				}
			})
			textReplace.push(getText.join(" "))

		}
			editBuilder.replace(validFullRange, textReplace.join("\n"));
			vscode.window.showInformationMessage('Commented console.log from flizkConsole! ') 
		}).catch(err => console.log(err));
		
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
