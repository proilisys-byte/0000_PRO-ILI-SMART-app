declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: any;
    jsPDF?: any;
    pagebreak?: { 
      mode?: string | string[]; 
      before?: string | string[]; 
      after?: string | string[]; 
      avoid?: string | string[];
    };
  }

  interface Html2Pdf {
    from(element: HTMLElement | string): Html2Pdf;
    set(options: Html2PdfOptions): Html2Pdf;
    save(): Promise<void>;
    output(type: string, options?: any): any;
  }

  function html2pdf(): Html2Pdf;
  function html2pdf(element: HTMLElement | string, options?: Html2PdfOptions): Promise<void>;

  export default html2pdf;
}
