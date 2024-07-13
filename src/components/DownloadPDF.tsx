import React, { FC, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Invoice, TInvoice } from '../data/types';
import { useDebounce } from '@uidotdev/usehooks';
import InvoicePage from './InvoicePage';

interface Props {
  data: Invoice;
  setData(data: Invoice): void;
}

const Download: FC<Props> = ({ data, setData }) => {
  const debounced = useDebounce(data, 500);
  const [isDownloading, setIsDownloading] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    file
      .text()
      .then((str: string) => {
        try {
          if (!(str.startsWith('{') && str.endsWith('}'))) {
            str = atob(str);
          }
          const d = JSON.parse(str);
          const dParsed = TInvoice.parse(d);
          console.info('parsed correctly');
          setData(dParsed);
        } catch (e) {
          console.error(e);
          return;
        }
      })
      .catch((err) => console.error(err));
  }

  const title = data.invoiceTitle ? data.invoiceTitle.toLowerCase() : 'invoice';

  const handleDownloadStart = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 1000);
  };

  return (
    <div className="download-pdf">
      <PDFDownloadLink
        key="pdf"
        document={<InvoicePage pdfMode={true} data={debounced} />}
        fileName={`${title}.pdf`}
        aria-label="Download Bill"
        title="Download Bill"
        className="download-pdf__link"
        onClick={handleDownloadStart}
      >
        {({ loading }) => (
          <button className="download-pdf__button" disabled={loading || isDownloading}>
            {isDownloading ? 'Downloading...' : 'Download Bill'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default Download;
