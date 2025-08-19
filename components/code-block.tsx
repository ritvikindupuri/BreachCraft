'use client';

import { useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, Copy, Download } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: FC<CodeBlockProps> = ({ code, language }) => {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const onCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
      toast({
        title: 'Copied to clipboard!',
        description: 'The script has been copied to your clipboard.',
      });
    });
  };

  const onDownload = () => {
    const extension = {
      bash: 'sh',
      python: 'py',
      powershell: 'ps1',
      perl: 'pl',
      ruby: 'rb',
      netcat: 'sh',
      php: 'php'
    }[language.toLowerCase()] || 'txt';
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payload.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-md border bg-card/50">
      <div className="flex items-center justify-between space-x-2 p-2 border-b bg-card/70 rounded-t-md">
        <span className="text-xs text-muted-foreground ml-2">{language}</span>
        <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={onDownload} title="Download script">
                <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCopy} title="Copy to clipboard">
            {hasCopied ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
            </Button>
        </div>
      </div>
      <pre className="p-4 text-sm overflow-x-auto font-code">
        <code>{code}</code>
      </pre>
    </div>
  );
};
