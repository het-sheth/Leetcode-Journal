'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface JournalEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function JournalEditor({ value, onChange }: JournalEditorProps) {
  const [activeTab, setActiveTab] = useState<string>('write');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-2">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="write">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[300px] p-3 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-mono text-neutral-800 dark:text-neutral-200 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your notes in Markdown..."
        />
      </TabsContent>

      <TabsContent value="preview">
        <div className="min-h-[300px] p-4 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 prose dark:prose-invert prose-sm max-w-none">
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-neutral-400 italic">Nothing to preview</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
