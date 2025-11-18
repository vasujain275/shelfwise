
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Book, BookSearchResponse } from '@/types/book';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, AlertCircle, FileDown, ChevronRight, HelpCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import jsBarcode from 'jsbarcode';

const barcodeStandards = [
  "CODE128", "CODE128A", "CODE128B", "CODE128C",
  "EAN13", "EAN8", "EAN5", "EAN2", "UPC",
  "CODE39", "ITF14", "MSI", "MSI10", "MSI11",
  "MSI1010", "MSI1110", "pharmacode", "codabar"
];

const SharedGenerateBarcodes: React.FC = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [barcodeStandard, setBarcodeStandard] = useState("CODE128");
  
  const [rows, setRows] = useState(13);
  const [cols, setCols] = useState(5);
  const [stickerWidth, setStickerWidth] = useState(38.1);
  const [stickerHeight, setStickerHeight] = useState(21.2);
  const [topMargin, setTopMargin] = useState(10.7);
  const [leftMargin, setLeftMargin] = useState(9.75);
  const [horizontalSpacing, setHorizontalSpacing] = useState(0);
  const [verticalSpacing, setVerticalSpacing] = useState(0);

  const maxStickers = rows * cols;

  const fetchBooks = useCallback(async (page: number) => {
    if (!query) {
      setBooks([]);
      setTotalPages(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/books/search?query=${query}&page=${page}&size=10`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result: BookSearchResponse = await response.json();
      setBooks(result.data);
      setTotalPages(result.pagination.totalPages);
      setCurrentPage(result.pagination.currentPage);
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        fetchBooks(0);
      } else {
        setBooks([]);
        setTotalPages(0);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query, fetchBooks]);

  const handlePageChange = (page: number) => {
    fetchBooks(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(0);
  };

  const handleSelectBook = (bookId: string) => {
    const newSelection = new Set(selectedBooks);
    if (newSelection.has(bookId)) {
      newSelection.delete(bookId);
    } else {
      if (newSelection.size < maxStickers) {
        newSelection.add(bookId);
      } else {
        alert(`You can only select up to ${maxStickers} books for a ${rows}x${cols} sheet.`);
      }
    }
    setSelectedBooks(newSelection);
  };

  const handleSelectAll = (isChecked: boolean | 'indeterminate') => {
    if (isChecked) {
      const allBookIds = books.map(b => b.id);
      const newSelection = new Set([...selectedBooks, ...allBookIds].slice(0, maxStickers));
      setSelectedBooks(newSelection);
    } else {
      const bookIdsOnPage = new Set(books.map(b => b.id));
      const newSelection = new Set([...selectedBooks].filter(id => !bookIdsOnPage.has(id)));
      setSelectedBooks(newSelection);
    }
  };

  const generatePdf = async () => {
    if (selectedBooks.size === 0) {
      alert('Please select at least one book to generate barcodes.');
      return;
    }
    setIsGenerating(true);

    try {
      // Fetch all books that are selected, regardless of the current page
      const response = await fetch(`/api/books/search?query=${query}&page=0&size=${totalPages * 10}&sortBy=accessionNumber&sortDir=ASC`);
      if (!response.ok) {
        throw new Error('Failed to fetch all selected books.');
      }
      const result: BookSearchResponse = await response.json();
      const allBooks = result.data;
      const booksToPrint = allBooks.filter(b => selectedBooks.has(b.id));

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      let stickerCount = 0;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (stickerCount >= booksToPrint.length) break;
          
          const book = booksToPrint[stickerCount];
          const x = leftMargin + (j * (stickerWidth + horizontalSpacing));
          const y = topMargin + (i * (stickerHeight + verticalSpacing));

          const barcodeValue = `${book.accessionNumber} - ${book.locationShelf || 'N/A'}.${book.locationRack || 'N/A'}`;
          
          const canvas = document.createElement('canvas');
          jsBarcode(canvas, barcodeValue, {
            format: barcodeStandard,
            width: 2, // Increased width for higher resolution
            height: 40, // Increased height for higher resolution
            fontSize: 0, // Hide text below barcode
            displayValue: false, // Do not display the human-readable value below the barcode
            margin: 0
          });
          const barcodeDataUrl = canvas.toDataURL('image/png');

          // Adjust addImage parameters to fit the barcode better within the sticker area
          doc.addImage(barcodeDataUrl, 'PNG', x + 2, y + 2, stickerWidth - 4, stickerHeight - 10);
          doc.setFontSize(8);
          doc.text(barcodeValue, x + stickerWidth / 2, y + stickerHeight - 5, { align: 'center' });

          stickerCount++;
        }
        if (stickerCount >= booksToPrint.length) break;
      }

      doc.save('barcodes.pdf');
    } catch (err) {
      setError('Failed to generate PDF. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getPaginationWindow = (current: number, total: number, window: number = 2) => {
    const pages: (number | 'ellipsis')[] = [];
    if (total <= 7 + window * 2) {
      for (let i = 0; i < total; i++) pages.push(i);
    } else {
      const left = Math.max(0, current - window);
      const right = Math.min(total - 1, current + window);
      if (left > 1) {
        pages.push(0);
        pages.push('ellipsis');
      } else {
        for (let i = 0; i < left; i++) pages.push(i);
      }
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < total - 2) {
        pages.push('ellipsis');
        pages.push(total - 1);
      } else {
        for (let i = right + 1; i < total; i++) pages.push(i);
      }
    }
    return pages;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto p-4 md:p-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col items-center justify-center text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Generate Book Barcodes</h1>
        <p className="text-muted-foreground">Select books and print barcodes on A4 sticker sheets.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                PDF & Sticker Settings
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium leading-none">How to Generate Barcodes</h4>
                      <p className="text-sm text-muted-foreground">
                        Follow these steps to create your custom barcode sheets:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li><strong>Search for Books:</strong> Use the search bar to find the books you need barcodes for.</li>
                        <li><strong>Select Books:</strong> Check the boxes next to the books you want to include.</li>
                        <li><strong>Configure Layout:</strong>
                          <ul className="list-disc list-inside pl-4 mt-1">
                            <li>Set the number of <strong>Rows</strong> and <strong>Columns</strong> for your sticker sheet.</li>
                            <li>Click <strong>Advanced Layout</strong> to fine-tune the exact dimensions in millimeters (mm).</li>
                            <li><strong>Sticker Width/Height:</strong> The size of each individual sticker.</li>
                            <li><strong>Top/Left Margin:</strong> The space from the edge of the A4 page to where the first sticker begins.</li>
                            <li><strong>Horizontal/Vertical Gutter:</strong> The spacing *between* each sticker.</li>
                          </ul>
                        </li>
                        <li><strong>Generate PDF:</strong> Click the button to create the PDF. It will be downloaded to your computer.</li>
                      </ol>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rows">Rows</Label>
                  <Input id="rows" type="number" value={rows} onChange={e => setRows(parseInt(e.target.value, 10) || 1)} min="1" />
                </div>
                <div>
                  <Label htmlFor="cols">Columns</Label>
                  <Input id="cols" type="number" value={cols} onChange={e => setCols(parseInt(e.target.value, 10) || 1)} min="1" />
                </div>
              </div>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Advanced Layout (mm)
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sticker-width">Sticker Width</Label>
                      <Input id="sticker-width" type="number" value={stickerWidth} onChange={e => setStickerWidth(parseFloat(e.target.value) || 0)} step="0.1" />
                    </div>
                    <div>
                      <Label htmlFor="sticker-height">Sticker Height</Label>
                      <Input id="sticker-height" type="number" value={stickerHeight} onChange={e => setStickerHeight(parseFloat(e.target.value) || 0)} step="0.1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="top-margin">Top Margin</Label>
                      <Input id="top-margin" type="number" value={topMargin} onChange={e => setTopMargin(parseFloat(e.target.value) || 0)} step="0.1" />
                    </div>
                    <div>
                      <Label htmlFor="left-margin">Left Margin</Label>
                      <Input id="left-margin" type="number" value={leftMargin} onChange={e => setLeftMargin(parseFloat(e.target.value) || 0)} step="0.1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="h-spacing">Horizontal Gutter</Label>
                      <Input id="h-spacing" type="number" value={horizontalSpacing} onChange={e => setHorizontalSpacing(parseFloat(e.target.value) || 0)} step="0.1" />
                    </div>
                    <div>
                      <Label htmlFor="v-spacing">Vertical Gutter</Label>
                      <Input id="v-spacing" type="number" value={verticalSpacing} onChange={e => setVerticalSpacing(parseFloat(e.target.value) || 0)} step="0.1" />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div>
                <Label htmlFor="barcode-standard">Barcode Standard</Label>
                <Select value={barcodeStandard} onValueChange={setBarcodeStandard}>
                  <SelectTrigger id="barcode-standard">
                    <SelectValue placeholder="Select standard" />
                  </SelectTrigger>
                  <SelectContent>
                    {barcodeStandards.map(standard => (
                      <SelectItem key={standard} value={standard}>{standard}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Alert>
                <AlertDescription>
                  Sheet capacity: <strong>{maxStickers}</strong> stickers.
                </AlertDescription>
              </Alert>
              <Button onClick={generatePdf} disabled={isGenerating || selectedBooks.size === 0} className="w-full">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                Generate PDF ({selectedBooks.size} selected)
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title, author, or accession number..."
              className="w-full pl-10 py-6 text-base"
              value={query}
              onChange={handleSearchChange}
            />
          </div>

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center my-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Searching...</p>
              </motion.div>
            )}
            {error && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Alert variant="destructive" className="max-w-2xl mx-auto">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            {!isLoading && !error && books.length > 0 && (
              <motion.div key="results" variants={containerVariants} initial="hidden" animate="visible">
                <div className="rounded-lg border overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={books.every(b => selectedBooks.has(b.id))}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Accession No.</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {books.map(book => (
                        <TableRow key={book.id} onClick={() => handleSelectBook(book.id)} className="cursor-pointer">
                          <TableCell>
                            <Checkbox
                              checked={selectedBooks.has(book.id)}
                              onCheckedChange={() => handleSelectBook(book.id)}
                            />
                          </TableCell>
                          <TableCell className="font-mono">{book.accessionNumber}</TableCell>
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell>{`${book.locationShelf || 'N/A'}.${book.locationRack || 'N/A'}`}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 0) handlePageChange(currentPage - 1); }} className={currentPage === 0 ? 'pointer-events-none opacity-50' : ''} />
                        </PaginationItem>
                        {getPaginationWindow(currentPage, totalPages).map((page, i) =>
                          page === 'ellipsis' ? (
                            <PaginationItem key={`ellipsis-${i}`}>
                              <span className="px-2">...</span>
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={page}>
                              <PaginationLink href="#" isActive={page === currentPage} onClick={(e) => { e.preventDefault(); handlePageChange(page as number); }}>
                                {(page as number) + 1}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}
                        <PaginationItem>
                          <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages - 1) handlePageChange(currentPage + 1); }} className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : ''} />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </motion.div>
            )}
            {!isLoading && !error && query && books.length === 0 && (
              <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-muted-foreground mt-8">
                <p>No books found for "{query}".</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SharedGenerateBarcodes;
