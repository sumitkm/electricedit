declare var Quill: QuillStatic;

declare module "Quill" {
	export = Quill;

}

declare interface QuillStatic{
	on(eventName: string, callback: (delta: any, source: string)=>void);
	addModule(id: string, options: any);

  getText():string;
  getText(start: number):string;
  getText(start: number, end: number):string;

	getLength():number;

  getContents(): any;
  getContents(start: number): any;
  getContents(start: number, end: number): any;

	getHTML(): string;


  insertText(index: number, text: string);
  insertText(index: number, text: string, name: string, value: string);
  insertText(index: number, text: string, formats: any);
  insertText(index: number, text: string, source: string);
  insertText(index: number, text: string, name: string, value: string, source: string);
  insertText(index: number, text: string, formats: any, source: string);

  deleteText(start: number, end: number);
  deleteText(start: number, end: number, source: string);

  formatText(start: number, end: number);
  formatText(start: number, end: number, name: string, value: string);
  formatText(start: number, end: number, formats: any);
  formatText(start: number, end: number, source: string);
  formatText(start: number, end: number, name: string, value: string, source: string);
  formatText(start: number, end: number, formats: string, source: string);


  formatLine(start: number, end: number);
  formatLine(start: number, end: number, name: string, value: string);
  formatLine(start: number, end: number, formats: any);
  formatLine(start: number, end: number, source: string);
  formatLine(start: number, end: number, name: string, value: string, source: string);
  formatLine(start: number, end: number, formats: any, source: string);


  insertEmbed(index: number, type: string, url: string);
  insertEmbed(index: number, type: string, url: string, source: string);

	updateContents(delta: any);

	setContents(delta: any);

	setHTML(html: string);

	setText(text: string);

	getSelection();

  setSelection(start: number, end: number);
  setSelection(start: number, end: number, source: string);
  setSelection(range: any);
  setSelection(range: any, source: string);

	prepareFormat(format: string, value: string);

	focus();

  getBounds(index: number): any;

	registerModule(name: string, callback : (quill: any, options: any)=>{});

	addModule(name: string, options: any);

	getModule(name);

	onModuleLoad(name: string, callback: (input:any) => {});

	addFormat(name: string, config: any);

	addContainer(cssClass: string, before: number);


}
